"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket/socket";
import { SOCKET_EVENTS } from "@/lib/socket/events";
import { startRing, stopRing } from "@/lib/audio/ringtone";
import type { ParticipantType, CallType } from "@/lib/socket/events";
import type { CallStatus, IncomingCall } from "./types";

// WebRTC 1:1 call hook. The Express backend only does signaling (see
// Backend/CHAT_VIDEO_FIXES.md §3) — media is peer-to-peer. Public STUN only;
// add a TURN server for production (symmetric-NAT / mobile networks).
// STUN is enough for same-network / simple NAT (usually desktop on Wi-Fi), but
// mobile on cellular sits behind Carrier-Grade / symmetric NAT and needs a TURN
// relay. Provide TURN via env (NEXT_PUBLIC_TURN_URL is comma-separated) — once
// set + rebuilt, mobile/cross-network calls connect.
const TURN_URL = process.env.NEXT_PUBLIC_TURN_URL;
const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302"] },
    ...(TURN_URL
      ? [
          {
            urls: TURN_URL.split(",").map((u) => u.trim()),
            username: process.env.NEXT_PUBLIC_TURN_USERNAME,
            credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
          },
        ]
      : []),
  ],
};

// Turn a getUserMedia failure into a precise, actionable Arabic message so the
// user knows WHY (permission / no device / busy / in-app browser / not https).
const describeMediaError = (err: unknown): string => {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    return "المتصفح لا يدعم الكاميرا/المايك — افتح الرابط في Chrome/Safari مباشرةً (مش من داخل واتساب/فيسبوك) وعلى https";
  }
  const name = (err as DOMException)?.name;
  switch (name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
      return "تم رفض إذن الكاميرا/المايك. اسمح به من إعدادات الموقع في المتصفح، أو افتح الرابط في المتصفح مباشرةً (مش من داخل تطبيق تاني)";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "لا توجد كاميرا/مايك متاحة على هذا الجهاز";
    case "NotReadableError":
    case "TrackStartError":
      return "الكاميرا/المايك مستخدمة في تطبيق آخر — أغلقه وحاول مجددًا";
    case "OverconstrainedError":
      return "إعدادات الكاميرا غير مدعومة على هذا الجهاز";
    case "SecurityError":
      return "الوصول محظور — تأكد أنك تفتح الموقع عبر https";
    default:
      return "تعذّر الوصول للكاميرا/المايك";
  }
};

interface UseVideoCallResult {
  status: CallStatus;
  incomingCall: IncomingCall | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  micOn: boolean;
  camOn: boolean;
  error: string | null;
  startCall: (
    receiverId: string,
    receiverType: ParticipantType,
    type?: CallType,
    consultationId?: string,
  ) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
  toggleMic: () => void;
  toggleCam: () => void;
}

export function useVideoCall(): UseVideoCallResult {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusRef = useRef<CallStatus>(status);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerIdRef = useRef<string | null>(null); // the other user's id (signaling target)
  const callIdRef = useRef<string | null>(null); // the call document id
  const roomIdRef = useRef<string | null>(null);
  const isCallerRef = useRef(false);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

  const getMedia = useCallback(async (type: CallType) => {
    // Insecure context / in-app webview → mediaDevices is undefined.
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      throw new Error(describeMediaError(null));
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "video",
      });
      setCamOn(type === "video");
    } catch (err) {
      // No camera (or it's busy)? Fall back to audio-only so a video call can
      // still connect from a camera-less device instead of failing outright.
      if (type === "video") {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });
          setCamOn(false);
        } catch (audioErr) {
          throw new Error(describeMediaError(audioErr));
        }
      } else {
        throw new Error(describeMediaError(err));
      }
    }
    localStreamRef.current = stream;
    setLocalStream(stream);
    setMicOn(true);
    return stream;
  }, []);

  const cleanup = useCallback(() => {
    pcRef.current?.getSenders().forEach((s) => s.track?.stop());
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    pendingCandidates.current = [];
    peerIdRef.current = null;
    callIdRef.current = null;
    roomIdRef.current = null;
    isCallerRef.current = false;
    setLocalStream(null);
    setRemoteStream(null);
  }, []);

  const buildPeer = useCallback(() => {
    const socket = getSocket();
    const pc = new RTCPeerConnection(ICE_SERVERS);

    localStreamRef.current
      ?.getTracks()
      .forEach((track) => pc.addTrack(track, localStreamRef.current!));

    pc.onicecandidate = (e) => {
      if (e.candidate && peerIdRef.current) {
        socket.emit(SOCKET_EVENTS.callIce, {
          targetId: peerIdRef.current,
          candidate: e.candidate,
          roomId: roomIdRef.current,
        });
      }
    };

    pc.ontrack = (e) => setRemoteStream(e.streams[0]);

    pc.onconnectionstatechange = () => {
      const st = pc.connectionState;
      if (st === "connected") setStatus("in-call");
      if (st === "failed" || st === "disconnected" || st === "closed") {
        setStatus((s) => (s === "in-call" ? "ended" : s));
      }
    };

    pcRef.current = pc;
    return pc;
  }, []);

  const flushCandidates = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc) return;
    for (const c of pendingCandidates.current) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(c));
      } catch {
        /* ignore bad candidate */
      }
    }
    pendingCandidates.current = [];
  }, []);

  // ── Signaling listeners ─────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();

    const onInitiated = (p: { callId: string; roomId: string }) => {
      callIdRef.current = p.callId;
      roomIdRef.current = p.roomId;
    };

    const onIncoming = (p: IncomingCall) => {
      // ignore a second incoming call while already busy
      if (pcRef.current || statusRef.current !== "idle") return;
      setIncomingCall(p);
      setStatus("ringing");
    };

    const onAccepted = async (p: { callId: string; roomId: string; from: string }) => {
      roomIdRef.current = p.roomId;
      setStatus("connecting");
      // only the original caller creates the offer
      if (!isCallerRef.current) return;
      const pc = buildPeer();
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit(SOCKET_EVENTS.callOffer, {
        targetId: peerIdRef.current,
        offer,
        roomId: roomIdRef.current,
      });
    };

    const onOffer = async (p: {
      from: string;
      offer: RTCSessionDescriptionInit;
      roomId: string;
    }) => {
      // callee side
      peerIdRef.current = p.from;
      roomIdRef.current = p.roomId;
      const pc = pcRef.current ?? buildPeer();
      await pc.setRemoteDescription(new RTCSessionDescription(p.offer));
      await flushCandidates();
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit(SOCKET_EVENTS.callAnswer, {
        targetId: p.from,
        answer,
        roomId: p.roomId,
      });
      setStatus("connecting");
    };

    const onAnswer = async (p: { from: string; answer: RTCSessionDescriptionInit }) => {
      const pc = pcRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(p.answer));
      await flushCandidates();
    };

    const onIce = async (p: { candidate: RTCIceCandidateInit }) => {
      const pc = pcRef.current;
      if (pc?.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(p.candidate));
        } catch {
          /* ignore */
        }
      } else {
        pendingCandidates.current.push(p.candidate);
      }
    };

    const onEnded = () => {
      setStatus("ended");
      setIncomingCall(null);
      cleanup();
    };

    const onRejected = () => {
      setStatus("ended");
      setIncomingCall(null);
      cleanup();
    };

    const onError = (p: { message: string }) => setError(p.message);

    socket.on(SOCKET_EVENTS.callInitiated, onInitiated);
    socket.on(SOCKET_EVENTS.callIncoming, onIncoming);
    socket.on(SOCKET_EVENTS.callAccepted, onAccepted);
    socket.on(SOCKET_EVENTS.callOffer, onOffer);
    socket.on(SOCKET_EVENTS.callAnswer, onAnswer);
    socket.on(SOCKET_EVENTS.callIce, onIce);
    socket.on(SOCKET_EVENTS.callEnded, onEnded);
    socket.on(SOCKET_EVENTS.callRejected, onRejected);
    socket.on(SOCKET_EVENTS.callError, onError);

    return () => {
      socket.off(SOCKET_EVENTS.callInitiated, onInitiated);
      socket.off(SOCKET_EVENTS.callIncoming, onIncoming);
      socket.off(SOCKET_EVENTS.callAccepted, onAccepted);
      socket.off(SOCKET_EVENTS.callOffer, onOffer);
      socket.off(SOCKET_EVENTS.callAnswer, onAnswer);
      socket.off(SOCKET_EVENTS.callIce, onIce);
      socket.off(SOCKET_EVENTS.callEnded, onEnded);
      socket.off(SOCKET_EVENTS.callRejected, onRejected);
      socket.off(SOCKET_EVENTS.callError, onError);
    };
  }, [buildPeer, flushCandidates, cleanup]);

  // keep the status ref in sync for use inside the (once-subscribed) listeners
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Ringtone: incoming warble for the callee, ringback tone for the caller.
  useEffect(() => {
    if (status === "ringing") startRing("incoming");
    else if (status === "calling") startRing("outgoing");
    else stopRing();
    return () => stopRing();
  }, [status]);

  // ── Public actions ──────────────────────────────────────────────────
  const startCall = useCallback(
    async (
      receiverId: string,
      receiverType: ParticipantType,
      type: CallType = "video",
      consultationId?: string,
    ) => {
      setError(null);
      try {
        await getMedia(type);
        isCallerRef.current = true;
        peerIdRef.current = receiverId;
        setStatus("calling");
        getSocket().emit(SOCKET_EVENTS.callInitiate, {
          receiverId,
          receiverType,
          consultationId,
          type,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "تعذّر الوصول للكاميرا/المايك",
        );
        cleanup();
        setStatus("idle");
      }
    },
    [getMedia, cleanup],
  );

  const acceptCall = useCallback(async () => {
    if (!incomingCall) return;
    setError(null);
    try {
      await getMedia(incomingCall.type);
      isCallerRef.current = false;
      peerIdRef.current = incomingCall.from;
      callIdRef.current = incomingCall.callId;
      roomIdRef.current = incomingCall.roomId;
      buildPeer(); // ready to receive the offer
      setStatus("connecting");
      getSocket().emit(SOCKET_EVENTS.callAccept, {
        callId: incomingCall.callId,
        roomId: incomingCall.roomId,
      });
      setIncomingCall(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "تعذّر الوصول للكاميرا/المايك",
      );
      cleanup();
      setStatus("idle");
    }
  }, [incomingCall, getMedia, buildPeer, cleanup]);

  const rejectCall = useCallback(() => {
    if (!incomingCall) return;
    getSocket().emit(SOCKET_EVENTS.callReject, {
      callId: incomingCall.callId,
      targetId: incomingCall.from,
    });
    setIncomingCall(null);
    setStatus("idle");
  }, [incomingCall]);

  const endCall = useCallback(() => {
    getSocket().emit(SOCKET_EVENTS.callEnd, {
      callId: callIdRef.current,
      roomId: roomIdRef.current,
      targetId: peerIdRef.current,
    });
    cleanup();
    setStatus("ended");
  }, [cleanup]);

  const toggleMic = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  }, []);

  const toggleCam = useCallback(() => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
    }
  }, []);

  // after a call ends, fall back to idle so a new/incoming call can start
  useEffect(() => {
    if (status !== "ended") return;
    const t = setTimeout(() => setStatus("idle"), 1500);
    return () => clearTimeout(t);
  }, [status]);

  // stop media if the component using the hook unmounts mid-call
  useEffect(() => cleanup, [cleanup]);

  return {
    status,
    incomingCall,
    localStream,
    remoteStream,
    micOn,
    camOn,
    error,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMic,
    toggleCam,
  };
}
