"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getConsultations,
  cancelConsultation,
  rescheduleConsultation,
} from "@/features/patient/api";
import type { Consultation } from "@/features/patient/api";

const statusOf = (c: Consultation) =>
  c.cancelled
    ? { label: "ملغية", cls: "bg-error-container text-on-error-container" }
    : c.isCompleted
      ? { label: "مكتملة", cls: "bg-primary-container text-white" }
      : { label: "قادمة", cls: "bg-surface-container-high text-primary" };

export default function PatientConsultationsPage() {
  const qc = useQueryClient();
  const { data: consultations = [], isLoading } = useQuery({
    queryKey: ["consultations"],
    queryFn: getConsultations,
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [time, setTime] = useState("");

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["consultations"] });

  const cancel = useMutation({
    mutationFn: (c: Consultation) => cancelConsultation(c._id, c.docId),
    onSuccess: invalidate,
  });
  const reschedule = useMutation({
    mutationFn: (c: Consultation) => rescheduleConsultation(c._id, time),
    onSuccess: () => {
      invalidate();
      setEditing(null);
      setTime("");
    },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-headline-md text-on-surface">استشاراتي</h1>

      {isLoading && (
        <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
      )}

      {!isLoading && consultations.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center shadow-card">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
            clinical_notes
          </span>
          <p className="mt-2 text-body-md text-on-surface-variant">
            لا توجد استشارات بعد.
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {consultations.map((c) => {
          const st = statusOf(c);
          const active = !c.cancelled && !c.isCompleted;
          const busy = cancel.isPending || reschedule.isPending;
          return (
            <li key={c._id} className="rounded-xl bg-white p-5 shadow-card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-primary">
                    <span className="material-symbols-outlined">clinical_notes</span>
                  </div>
                  <div>
                    <p className="text-label-md text-on-surface">
                      د. {c.docData?.doctorName ?? "طبيب"}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-caption text-on-surface-variant">
                      <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                      {c.consultDay} — {c.consultTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-caption ${st.cls}`}>
                    {st.label}
                  </span>
                  {active && (
                    <>
                      <button
                        onClick={() => {
                          setEditing(editing === c._id ? null : c._id);
                          setTime(c.consultTime);
                        }}
                        disabled={busy}
                        className="rounded-lg border border-outline-variant px-3 py-1.5 text-caption text-primary transition-colors hover:bg-surface-container-low disabled:opacity-40"
                      >
                        تغيير الوقت
                      </button>
                      <button
                        onClick={() => cancel.mutate(c)}
                        disabled={busy}
                        className="rounded-lg border border-outline-variant px-3 py-1.5 text-caption text-error transition-colors hover:bg-error-container disabled:opacity-40"
                      >
                        إلغاء
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editing === c._id && (
                <div className="mt-4 flex items-center gap-2 border-t border-outline-variant pt-4">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="rounded-xl border border-outline-variant bg-white px-4 py-2 text-body-md outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => reschedule.mutate(c)}
                    disabled={!time || reschedule.isPending}
                    className="rounded-xl bg-primary-container px-5 py-2 text-caption text-white disabled:opacity-40"
                  >
                    حفظ الوقت
                  </button>
                  {reschedule.isError && (
                    <span className="text-caption text-error">الوقت غير متاح</span>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
