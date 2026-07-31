"use client";

import { VideoStream } from "./VideoStream";
import type { CallStatus } from "../types";

interface CallScreenProps {
  status: CallStatus;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  micOn: boolean;
  camOn: boolean;
  title?: string;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onEnd: () => void;
}

const statusLabel: Record<CallStatus, string> = {
  idle: "",
  calling: "جارٍ الاتصال…",
  ringing: "مكالمة واردة…",
  connecting: "جارٍ الاتصال…",
  "in-call": "",
  ended: "انتهت المكالمة",
};

// Full-screen 1:1 call overlay: remote fills the screen, local is a PiP.
export function CallScreen({
  status,
  localStream,
  remoteStream,
  micOn,
  camOn,
  title,
  onToggleMic,
  onToggleCam,
  onEnd,
}: CallScreenProps) {
  const connected = status === "in-call" && !!remoteStream;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-inverse-surface">
      {/* Remote video / placeholder */}
      <div className="relative flex-1 overflow-hidden">
        {connected ? (
          <VideoStream
            stream={remoteStream}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-inverse-on-surface">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
              <span className="material-symbols-outlined text-[48px]">
                person
              </span>
            </div>
            <p className="text-headline-md">{title ?? "مكالمة"}</p>
            <p className="animate-pulse text-body-md text-white/70">
              {statusLabel[status]}
            </p>
          </div>
        )}

        {/* Local PiP */}
        {localStream && (
          <div className="absolute bottom-4 left-4 h-40 w-28 overflow-hidden rounded-xl border-2 border-white/20 bg-black shadow-lg md:h-48 md:w-36">
            <VideoStream
              stream={localStream}
              muted
              className={`h-full w-full object-cover ${camOn ? "" : "hidden"}`}
            />
            {!camOn && (
              <div className="flex h-full w-full items-center justify-center text-white/60">
                <span className="material-symbols-outlined">videocam_off</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 bg-black/40 py-6">
        <button
          onClick={onToggleMic}
          className={`flex h-14 w-14 items-center justify-center rounded-full transition-all active:scale-95 ${
            micOn ? "bg-white/15 text-white" : "bg-white text-inverse-surface"
          }`}
          aria-label={micOn ? "كتم المايك" : "تشغيل المايك"}
        >
          <span className="material-symbols-outlined">
            {micOn ? "mic" : "mic_off"}
          </span>
        </button>

        <button
          onClick={onEnd}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-error text-white transition-all hover:opacity-90 active:scale-95"
          aria-label="إنهاء المكالمة"
        >
          <span className="material-symbols-outlined text-[28px]">call_end</span>
        </button>

        <button
          onClick={onToggleCam}
          className={`flex h-14 w-14 items-center justify-center rounded-full transition-all active:scale-95 ${
            camOn ? "bg-white/15 text-white" : "bg-white text-inverse-surface"
          }`}
          aria-label={camOn ? "إيقاف الكاميرا" : "تشغيل الكاميرا"}
        >
          <span className="material-symbols-outlined">
            {camOn ? "videocam" : "videocam_off"}
          </span>
        </button>
      </div>
    </div>
  );
}
