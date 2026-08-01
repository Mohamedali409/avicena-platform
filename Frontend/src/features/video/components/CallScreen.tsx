"use client";

import { useEffect, useState } from "react";
import { VideoStream } from "./VideoStream";
import type { CallStatus } from "../types";

interface CallScreenProps {
  status: CallStatus;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  micOn: boolean;
  camOn: boolean;
  title?: string;
  /** true → render as a contained panel inside the chat page (not full-screen) */
  embedded?: boolean;
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

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// 1:1 call view. Embedded (a panel inside the chat) by default; a maximize
// button expands it to a full-screen overlay. Shows a live elapsed timer.
export function CallScreen({
  status,
  localStream,
  remoteStream,
  micOn,
  camOn,
  title,
  embedded = false,
  onToggleMic,
  onToggleCam,
  onEnd,
}: CallScreenProps) {
  const connected = status === "in-call" && !!remoteStream;

  // Elapsed-time counter — runs only while the call is connected.
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (status !== "in-call") {
      setElapsed(0);
      return;
    }
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  // Maximize toggle — only meaningful when embedded.
  const [expanded, setExpanded] = useState(false);
  const fullscreen = !embedded || expanded;

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-50 flex flex-col bg-inverse-surface"
          : "relative flex h-[70vh] flex-col overflow-hidden rounded-xl bg-inverse-surface shadow-card"
      }
    >
      {/* Remote video / placeholder */}
      <div className="relative flex-1 overflow-hidden">
        {/* Top bar: timer / status + maximize toggle */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3">
          <span className="rounded-full bg-black/45 px-3 py-1 text-sm font-medium text-white backdrop-blur">
            {status === "in-call" ? fmt(elapsed) : statusLabel[status]}
          </span>
          {embedded && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-all hover:bg-black/60 active:scale-95"
              aria-label={expanded ? "تصغير" : "تكبير"}
            >
              <span className="material-symbols-outlined text-[20px]">
                {expanded ? "close_fullscreen" : "open_in_full"}
              </span>
            </button>
          )}
        </div>

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
