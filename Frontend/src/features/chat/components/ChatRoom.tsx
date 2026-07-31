"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@/features/chat/useChat";
import type { ChatMessage } from "@/features/chat/types";

interface ChatRoomProps {
  roomId: string;
  selfId: string | null;
  /** optional header title (e.g. the doctor's name) */
  title?: string;
  /** optional: called when the user taps the call button */
  onStartCall?: () => void;
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

export function ChatRoom({ roomId, selfId, title, onStartCall }: ChatRoomProps) {
  const receiverId = useMemo(
    () => deriveReceiverId(roomId, selfId),
    [roomId, selfId],
  );
  const { messages, loadingHistory, error, peerTyping, sendMessage, notifyTyping } =
    useChat({ roomId, receiverId, selfId });

  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // keep the view pinned to the latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, peerTyping]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
  };

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
          <button
            onClick={onStartCall}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-white transition-all hover:opacity-90 active:scale-95"
            aria-label="مكالمة فيديو"
          >
            <span className="material-symbols-outlined">videocam</span>
          </button>
        )}
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface-container-low px-6 py-4">
        {loadingHistory && (
          <p className="py-8 text-center text-caption text-on-surface-variant">
            جارٍ تحميل الرسائل…
          </p>
        )}
        {!loadingHistory && messages.length === 0 && (
          <p className="py-8 text-center text-caption text-on-surface-variant">
            ابدأ المحادثة بأول رسالة
          </p>
        )}

        {messages.map((m) => (
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
        ))}

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

      {/* Composer */}
      <form
        onSubmit={submit}
        className="flex items-center gap-3 border-t border-outline-variant px-6 py-4"
      >
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
    </div>
  );
}
