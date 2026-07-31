"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listAppointments, cancelAppointment } from "@/features/booking/api";
import type { Appointment } from "@/features/booking/api";
import { getMyChatRequests } from "@/features/chat/api";
import type { ChatRequestStatus } from "@/features/chat/types";
import { ChatRequestAction } from "@/features/chat/components/ChatRequestAction";
import { useAuth } from "@/store/auth.store";

const statusOf = (a: Appointment) =>
  a.cancelled
    ? { label: "ملغي", cls: "bg-error-container text-on-error-container" }
    : a.isCompleted
      ? { label: "مكتمل", cls: "bg-primary-container text-white" }
      : { label: "قادم", cls: "bg-surface-container-high text-primary" };

export default function PatientAppointmentsPage() {
  const qc = useQueryClient();
  const selfId = useAuth((s) => s.session?.user._id ?? null);
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => listAppointments(1, 50),
  });

  // latest chat-request status per doctor (roomId encodes the docId)
  const { data: myRequests = [] } = useQuery({
    queryKey: ["my-chat-requests"],
    queryFn: getMyChatRequests,
  });
  const statusByDoc = useMemo(() => {
    const m = new Map<string, ChatRequestStatus>();
    for (const r of myRequests) {
      if (!m.has(r.docId)) m.set(r.docId, r.status); // requests are newest-first
    }
    return m;
  }, [myRequests]);

  const cancel = useMutation({
    mutationFn: (id: string) => cancelAppointment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-headline-md text-on-surface">مواعيدي</h1>

      {isLoading && (
        <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
      )}

      {!isLoading && appointments.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center shadow-card">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
            event_busy
          </span>
          <p className="mt-2 text-body-md text-on-surface-variant">
            لا توجد مواعيد بعد.
          </p>
          <Link
            href="/doctors"
            className="mt-4 inline-block rounded-xl bg-primary-container px-6 py-3 text-label-md text-white"
          >
            احجز موعدك الأول
          </Link>
        </div>
      )}

      <ul className="space-y-3">
        {appointments.map((a) => {
          const st = statusOf(a);
          const doc = a.docData as
            | { doctorName?: string; specialization?: string }
            | undefined;
          return (
            <li
              key={a._id}
              className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-primary">
                  <span className="material-symbols-outlined">stethoscope</span>
                </div>
                <div>
                  <p className="text-label-md text-on-surface">
                    د. {doc?.doctorName ?? "طبيب"}
                  </p>
                  <p className="text-caption text-on-surface-variant">
                    {doc?.specialization ?? ""}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-caption text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px]">
                      calendar_month
                    </span>
                    {a.slotDate} — {a.slotTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-caption ${st.cls}`}>
                  {st.label}
                </span>
                {!a.cancelled && (
                  <ChatRequestAction
                    docId={a.docId}
                    doctorName={doc?.doctorName ?? ""}
                    selfId={selfId}
                    status={statusByDoc.get(a.docId)}
                  />
                )}
                {!a.cancelled && !a.isCompleted && (
                  <button
                    onClick={() => cancel.mutate(a._id)}
                    disabled={cancel.isPending}
                    className="rounded-lg border border-outline-variant px-3 py-1.5 text-caption text-error transition-colors hover:bg-error-container disabled:opacity-40"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
