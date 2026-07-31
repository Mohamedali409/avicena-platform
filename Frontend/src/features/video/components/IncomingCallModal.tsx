"use client";

import type { IncomingCall } from "../types";

interface Props {
  call: IncomingCall;
  onAccept: () => void;
  onReject: () => void;
}

// Ringing prompt for the callee. Rendered globally by CallProvider.
export function IncomingCallModal({ call, onAccept, onReject }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-card-hover">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container-low text-primary">
          <span className="material-symbols-outlined text-[40px]">
            {call.type === "video" ? "videocam" : "call"}
          </span>
        </div>

        <p className="text-headline-md text-on-surface">مكالمة واردة</p>
        <p className="mt-1 text-body-md text-on-surface-variant">
          {call.callerType === "doctor" ? "طبيب" : "مريض"} يتصل بك
          {call.type === "video" ? " (فيديو)" : " (صوت)"}
        </p>

        <div className="mt-8 flex items-center justify-center gap-8">
          <button
            onClick={onReject}
            className="flex flex-col items-center gap-1"
            aria-label="رفض"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-error text-white transition-all active:scale-95">
              <span className="material-symbols-outlined">call_end</span>
            </span>
            <span className="text-caption text-on-surface-variant">رفض</span>
          </button>

          <button
            onClick={onAccept}
            className="flex flex-col items-center gap-1"
            aria-label="قبول"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-white transition-all active:scale-95">
              <span className="material-symbols-outlined">call</span>
            </span>
            <span className="text-caption text-on-surface-variant">قبول</span>
          </button>
        </div>
      </div>
    </div>
  );
}
