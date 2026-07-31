"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/features/chat/api";
import { listAppointments } from "@/features/booking/api";
import { CallHistory } from "@/features/video/components/CallHistory";
import { useAuth } from "@/store/auth.store";

const timeLabel = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
    : "";

// Patient conversations list. Doctor names are resolved from the patient's
// appointments (docId → doctorName).
export default function PatientChatListPage() {
  const selfId = useAuth((s) => s.session?.user._id ?? null);

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => listAppointments(1, 50),
  });

  const nameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of appointments) {
      const doc = a.docData as { doctorName?: string } | undefined;
      if (a.docId && doc?.doctorName) m.set(a.docId, `د. ${doc.doctorName}`);
    }
    return m;
  }, [appointments]);

  const otherId = (roomId: string) =>
    selfId ? (roomId.split("_").find((id) => id !== selfId) ?? "") : "";

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-headline-md text-on-surface">المحادثات</h1>

      {isLoading && (
        <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
      )}

      {!isLoading && conversations.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center shadow-card">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
            forum
          </span>
          <p className="mt-2 text-body-md text-on-surface-variant">
            لا توجد محادثات بعد. تُفتح المحادثة مع الطبيب قرب موعد حجزك.
          </p>
          <Link
            href="/doctors"
            className="mt-4 inline-block rounded-xl bg-primary-container px-6 py-3 text-label-md text-white"
          >
            تصفّح الأطباء
          </Link>
        </div>
      )}

      <ul className="space-y-2">
        {conversations.map((c) => {
          const other = otherId(c.roomId);
          const name = nameById.get(other) ?? `الطبيب ${other.slice(-6)}`;
          return (
            <li key={c.roomId}>
              <Link
                href={`/patient/chat/${c.roomId}?name=${encodeURIComponent(name)}`}
                className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-card transition-all hover:shadow-card-hover"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-surface-container-low text-primary">
                  <span className="material-symbols-outlined">stethoscope</span>
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
