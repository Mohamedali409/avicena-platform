"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendChatRequest } from "@/features/chat/api";
import type { ChatRequestStatus } from "@/features/chat/types";

const roomWith = (a: string, b: string) => [a, b].sort().join("_");

interface Props {
  docId: string;
  doctorName: string;
  selfId: string | null;
  /** latest request status between this patient and doctor, if any */
  status?: ChatRequestStatus;
}

// Status-aware chat entry for the patient. The doctor must approve the
// conversation, so this sends a chat-request (with a first message) and reflects
// its state: none/rejected → ask, pending → waiting, accepted → open the room.
export function ChatRequestAction({ docId, doctorName, selfId, status }: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const send = useMutation({
    mutationFn: () => sendChatRequest(docId, message.trim()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-chat-requests"] });
      setOpen(false);
      setMessage("");
    },
  });

  if (status === "accepted") {
    return (
      <Link
        href={`/patient/chat/${roomWith(selfId ?? "", docId)}?name=${encodeURIComponent("د. " + doctorName)}`}
        className="flex items-center gap-1 rounded-lg bg-primary-container px-3 py-1.5 text-caption text-white transition-colors hover:opacity-90"
      >
        <span className="material-symbols-outlined text-[16px]">forum</span>
        فتح المحادثة
      </Link>
    );
  }

  if (status === "pending") {
    return (
      <span className="flex items-center gap-1 rounded-lg bg-surface-container-high px-3 py-1.5 text-caption text-on-surface-variant">
        <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
        بانتظار موافقة الطبيب
      </span>
    );
  }

  // none or rejected → allow (re)requesting
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 rounded-lg border border-outline-variant px-3 py-1.5 text-caption text-primary transition-colors hover:bg-surface-container-low"
      >
        <span className="material-symbols-outlined text-[16px]">chat_add_on</span>
        {status === "rejected" ? "إعادة الطلب" : "اطلب محادثة"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-card-hover">
            <h3 className="mb-1 text-label-md text-on-surface">
              طلب محادثة مع د. {doctorName}
            </h3>
            <p className="mb-4 text-caption text-on-surface-variant">
              اكتب رسالتك الأولى — سيراها الطبيب ويوافق على بدء المحادثة.
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="مثال: السلام عليكم دكتور، عندي استفسار بخصوص…"
              className="w-full rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
            />
            {send.isError && (
              <p className="mt-1 text-caption text-error">
                تعذّر إرسال الطلب، حاول مرة أخرى.
              </p>
            )}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-2 text-label-md text-on-surface-variant"
              >
                إلغاء
              </button>
              <button
                onClick={() => send.mutate()}
                disabled={!message.trim() || send.isPending}
                className="rounded-xl bg-primary-container px-5 py-2 text-label-md text-white disabled:opacity-40"
              >
                {send.isPending ? "جارٍ الإرسال…" : "إرسال الطلب"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
