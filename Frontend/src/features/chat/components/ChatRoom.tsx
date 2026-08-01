"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useChat } from "@/features/chat/useChat";
import { uploadVoice } from "@/features/chat/api";
import type { ChatMessage } from "@/features/chat/types";
import { getCallHistory } from "@/features/video/api";
import type { CallRecord } from "@/features/video/types";

// Voice notes are served by the API host (not the Next app), so prefix the URL.
const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/+$/, "");

interface ChatRoomProps {
  roomId: string;
  selfId: string | null;
  /** optional header title (e.g. the doctor's name) */
  title?: string;
  /** optional: called when the user taps a call button (video or audio) */
  onStartCall?: (type: "video" | "audio") => void;
}

// roomId is `${sortedIdA}_${sortedIdB}` — the other participant is whichever
// half isn't me. This gives us receiverId without threading it through props.
const deriveReceiverId = (roomId: string, selfId: string | null) =>
  selfId ? (roomId.split("_").find((id) => id !== selfId) ?? null) : null;

const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

const fmtDuration = (s: number) =>
  s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : "";

// Direction + status for an inline call entry, from the current user's view.
const callMeta = (c: CallRecord, selfId: string | null) => {
  const outgoing = c.callerId === selfId;
  const failed = c.status === "missed" || c.status === "rejected";
  return {
    icon: failed
      ? outgoing
        ? "call_missed_outgoing"
        : "call_missed"
      : c.type === "video"
        ? "videocam"
        : "call",
    color: failed ? "text-error" : "text-primary",
    label: `${c.type === "video" ? "مكالمة فيديو" : "مكالمة صوت"} ${outgoing ? "صادرة" : "واردة"}`,
    detail: failed
      ? c.status === "missed"
        ? "فائتة"
        : "مرفوضة"
      : fmtDuration(c.durationInSeconds),
  };
};

type TimelineItem =
  | { kind: "msg"; at: string; msg: ChatMessage }
  | { kind: "call"; at: string; call: CallRecord };

export function ChatRoom({ roomId, selfId, title, onStartCall }: ChatRoomProps) {
  const receiverId = useMemo(
    () => deriveReceiverId(roomId, selfId),
    [roomId, selfId],
  );
  const {
    messages,
    loadingHistory,
    error,
    peerTyping,
    sendMessage,
    sendVoice,
    notifyTyping,
  } = useChat({ roomId, receiverId, selfId });

  // Call history for THIS conversation, interleaved with the messages so the
  // thread shows "video call · 0:31 / missed" entries inline (WhatsApp-style).
  const { data: allCalls = [] } = useQuery({
    queryKey: ["call-history"],
    queryFn: () => getCallHistory(1, 50),
  });
  const roomCalls = useMemo(
    () => allCalls.filter((c) => (c.roomId ?? "").replace(/^call_/, "") === roomId),
    [allCalls, roomId],
  );
  const timeline = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = [
      ...messages.map((m) => ({ kind: "msg" as const, at: m.createdAt, msg: m })),
      ...roomCalls.map((c) => ({ kind: "call" as const, at: c.createdAt, call: c })),
    ];
    return items.sort(
      (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime(),
    );
  }, [messages, roomCalls]);

  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // keep the view pinned to the latest item
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [timeline, peerTyping]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
  };

  // ── Voice notes: record via MediaRecorder → upload → send ──────────────
  const [recording, setRecording] = useState(false);
  const [recElapsed, setRecElapsed] = useState(0);
  const [uploadingVoice, setUploadingVoice] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recStreamRef = useRef<MediaStream | null>(null);
  const recStartRef = useRef(0);
  const cancelledRef = useRef(false);

  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recStreamRef.current = stream;
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      cancelledRef.current = false;
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        recStreamRef.current?.getTracks().forEach((t) => t.stop());
        recStreamRef.current = null;
        setRecording(false);
        if (cancelledRef.current || chunksRef.current.length === 0) return;
        const blob = new Blob(chunksRef.current, {
          type: mr.mimeType || "audio/webm",
        });
        const duration = Math.max(
          1,
          Math.round((Date.now() - recStartRef.current) / 1000),
        );
        try {
          setUploadingVoice(true);
          const url = await uploadVoice(blob);
          sendVoice(url, duration);
        } catch {
          setMicError("تعذّر رفع التسجيل");
        } finally {
          setUploadingVoice(false);
        }
      };
      recorderRef.current = mr;
      recStartRef.current = Date.now();
      setRecElapsed(0);
      mr.start();
      setRecording(true);
    } catch {
      setMicError("تعذّر الوصول للمايك — تأكد من الإذن");
    }
  };

  const stopRecording = () => {
    cancelledRef.current = false;
    recorderRef.current?.stop();
  };

  const cancelRecording = () => {
    cancelledRef.current = true;
    recorderRef.current?.stop();
  };

  // Tick the recording timer once per second while recording.
  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setRecElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const isMine = (m: ChatMessage) => m.senderId === selfId;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl bg-white shadow-card">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-primary">
            <span className="material-symbols-outlined">stethoscope</span>
          </div>
          <div>
            <p className="text-label-md text-on-surface">{title ?? "المحادثة"}</p>
            <p className="text-caption text-on-surface-variant">
              {peerTyping ? "يكتب الآن…" : "متصل"}
            </p>
          </div>
        </div>
        {onStartCall && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onStartCall("audio")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-primary transition-all hover:bg-surface-container-low active:scale-95"
              aria-label="مكالمة صوتية"
            >
              <span className="material-symbols-outlined">call</span>
            </button>
            <button
              onClick={() => onStartCall("video")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-white transition-all hover:opacity-90 active:scale-95"
              aria-label="مكالمة فيديو"
            >
              <span className="material-symbols-outlined">videocam</span>
            </button>
          </div>
        )}
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface-container-low px-6 py-4">
        {loadingHistory && (
          <p className="py-8 text-center text-caption text-on-surface-variant">
            جارٍ تحميل الرسائل…
          </p>
        )}
        {!loadingHistory && timeline.length === 0 && (
          <p className="py-8 text-center text-caption text-on-surface-variant">
            ابدأ المحادثة بأول رسالة
          </p>
        )}

        {timeline.map((item) => {
          // Inline call entry (WhatsApp-style, centered pill).
          if (item.kind === "call") {
            const c = item.call;
            const meta = callMeta(c, selfId);
            return (
              <div key={`call-${c._id}`} className="flex justify-center">
                <div className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-caption shadow-sm">
                  <span className={`material-symbols-outlined text-[18px] ${meta.color}`}>
                    {meta.icon}
                  </span>
                  <span className="text-on-surface">{meta.label}</span>
                  {meta.detail && (
                    <span className="text-on-surface-variant">· {meta.detail}</span>
                  )}
                  <span className="text-[10px] text-on-surface-variant">
                    {timeLabel(c.createdAt)}
                  </span>
                </div>
              </div>
            );
          }

          // Voice-note bubble.
          const m = item.msg;
          if (m.type === "audio" && m.audioUrl) {
            return (
              <div
                key={m._id}
                className={`flex ${isMine(m) ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 shadow-sm ${
                    isMine(m) ? "bg-primary-container" : "bg-white"
                  }`}
                >
                  <audio
                    controls
                    preload="metadata"
                    src={`${API_BASE}${m.audioUrl}`}
                    className="h-10 w-56 max-w-full"
                  />
                  <div
                    className={`mt-1 flex items-center gap-1 text-[10px] ${
                      isMine(m) ? "text-white/70" : "text-on-surface-variant"
                    }`}
                  >
                    <span>{timeLabel(m.createdAt)}</span>
                    {m.duration ? <span>· {fmtDuration(m.duration)}</span> : null}
                    {isMine(m) &&
                      (m.pending ? (
                        <span className="material-symbols-outlined text-[12px]">
                          schedule
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-[12px]">
                          {m.isRead ? "done_all" : "done"}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            );
          }

          // Chat message bubble.
          return (
            <div
              key={m._id}
              className={`flex ${isMine(m) ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[75%] rounded-xl px-4 py-2 shadow-sm ${
                  isMine(m)
                    ? "bg-primary-container text-white"
                    : "bg-white text-on-surface"
                }`}
              >
                <p className="whitespace-pre-wrap break-words text-body-md">
                  {m.message}
                </p>
                <div
                  className={`mt-1 flex items-center gap-1 text-[10px] ${
                    isMine(m) ? "text-white/70" : "text-on-surface-variant"
                  }`}
                >
                  <span>{timeLabel(m.createdAt)}</span>
                  {isMine(m) &&
                    (m.pending ? (
                      <span className="material-symbols-outlined text-[12px]">
                        schedule
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[12px]">
                        {m.isRead ? "done_all" : "done"}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          );
        })}

        {peerTyping && (
          <div className="flex justify-end">
            <div className="rounded-xl bg-white px-4 py-2 text-caption text-on-surface-variant shadow-sm">
              يكتب…
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="bg-error-container px-6 py-2 text-caption text-on-error-container">
          {error}
        </p>
      )}

      {micError && (
        <p className="bg-error-container px-6 py-2 text-caption text-on-error-container">
          {micError}
        </p>
      )}

      {/* Composer */}
      <div className="flex items-center gap-3 border-t border-outline-variant px-6 py-4">
        {recording ? (
          <>
            <button
              type="button"
              onClick={cancelRecording}
              className="flex h-12 w-12 items-center justify-center rounded-full text-error transition-all hover:bg-error-container/40 active:scale-95"
              aria-label="إلغاء التسجيل"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
            <div className="flex flex-1 items-center gap-2 text-error">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-error" />
              <span className="text-caption">جارٍ التسجيل…</span>
              <span className="font-mono text-caption tabular-nums">
                {`${Math.floor(recElapsed / 60)}:${String(recElapsed % 60).padStart(2, "0")}`}
              </span>
            </div>
            <button
              type="button"
              onClick={stopRecording}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-error text-white transition-all hover:opacity-90 active:scale-95"
              aria-label="إرسال التسجيل"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </>
        ) : (
          <form onSubmit={submit} className="flex flex-1 items-center gap-3">
            <button
              type="button"
              onClick={startRecording}
              disabled={uploadingVoice}
              className="flex h-12 w-12 items-center justify-center rounded-full text-primary transition-all hover:bg-surface-container-low active:scale-95 disabled:opacity-40"
              aria-label="تسجيل رسالة صوتية"
            >
              <span className="material-symbols-outlined">
                {uploadingVoice ? "hourglass_empty" : "mic"}
              </span>
            </button>
            <input
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                notifyTyping();
              }}
              placeholder="اكتب رسالتك…"
              className="flex-1 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
              aria-label="إرسال"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
