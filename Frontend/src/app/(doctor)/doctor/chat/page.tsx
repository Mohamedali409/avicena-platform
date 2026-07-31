"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getConversations,
  getDoctorChatRequests,
  acceptChatRequest,
  rejectChatRequest,
} from "@/features/chat/api";
import { getDoctorAppointments } from "@/features/doctor/api";
import { CallHistory } from "@/features/video/components/CallHistory";
import { useAuth } from "@/store/auth.store";

const timeLabel = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
    : "";

export default function DoctorChatListPage() {
  const qc = useQueryClient();
  const selfId = useAuth((s) => s.session?.user._id ?? null);

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["doctor-conversations"],
    queryFn: getConversations,
  });
  const { data: requests = [] } = useQuery({
    queryKey: ["doctor-chat-requests"],
    queryFn: () => getDoctorChatRequests("pending"),
  });
  const { data: appointments = [] } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: getDoctorAppointments,
  });

  const nameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of appointments) {
      if (a.userId && a.userData?.name) m.set(a.userId, a.userData.name);
    }
    return m;
  }, [appointments]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["doctor-chat-requests"] });
    qc.invalidateQueries({ queryKey: ["doctor-conversations"] });
  };
  const accept = useMutation({ mutationFn: acceptChatRequest, onSuccess: invalidate });
  const reject = useMutation({
    mutationFn: (roomId: string) => rejectChatRequest(roomId),
    onSuccess: invalidate,
  });

  const otherId = (roomId: string) =>
    selfId ? (roomId.split("_").find((id) => id !== selfId) ?? "") : "";

  const busy = accept.isPending || reject.isPending;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-headline-md text-on-surface">محادثات المرضى</h1>

      {/* Pending requests */}
      {requests.length > 0 && (
        <section className="space-y-2">
          <h2 className="flex items-center gap-2 text-label-md text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-primary">
              mark_chat_unread
            </span>
            طلبات محادثة جديدة ({requests.length})
          </h2>
          {requests.map((r) => (
            <div
              key={r._id}
              className="rounded-xl border border-primary/30 bg-primary-container/5 p-4 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-label-md text-on-surface">
                    {nameById.get(r.userId) ?? `مريض ${r.userId.slice(-6)}`}
                  </p>
                  <p className="mt-1 text-body-md text-on-surface-variant">
                    {r.initialMessage}
                  </p>
                </div>
                <span className="flex-shrink-0 text-caption text-on-surface-variant">
                  {timeLabel(r.createdAt)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => reject.mutate(r.roomId)}
                  disabled={busy}
                  className="rounded-lg border border-outline-variant px-4 py-1.5 text-caption text-error transition-colors hover:bg-error-container disabled:opacity-40"
                >
                  رفض
                </button>
                <button
                  onClick={() => accept.mutate(r.roomId)}
                  disabled={busy}
                  className="rounded-lg bg-primary-container px-4 py-1.5 text-caption text-white transition-colors hover:opacity-90 disabled:opacity-40"
                >
                  قبول
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Active conversations */}
      {isLoading && (
        <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
      )}
      {!isLoading && conversations.length === 0 && requests.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center shadow-card">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
            forum
          </span>
          <p className="mt-2 text-body-md text-on-surface-variant">
            لا توجد محادثات أو طلبات بعد.
          </p>
        </div>
      )}

      <ul className="space-y-2">
        {conversations.map((c) => {
          const other = otherId(c.roomId);
          const name = nameById.get(other) ?? `مريض ${other.slice(-6)}`;
          return (
            <li key={c.roomId}>
              <Link
                href={`/doctor/chat/${c.roomId}?name=${encodeURIComponent(name)}`}
                className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-card transition-all hover:shadow-card-hover"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-surface-container-low text-primary">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-label-md text-on-surface">{name}</p>
                    <span className="flex-shrink-0 text-caption text-on-surface-variant">
                      {timeLabel(c.lastMessageAt)}
                    </span>
                  </div>
                  <p className="truncate text-caption text-on-surface-variant">
                    {c.lastMessage ?? "اضغط لفتح المحادثة"}
                  </p>
                </div>
                {typeof c.unread === "number" && c.unread > 0 && (
                  <span className="flex h-6 min-w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-container px-2 text-caption text-white">
                    {c.unread}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <CallHistory />
    </div>
  );
}
