"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDoctorAppointments,
  completeDoctorAppointment,
  cancelDoctorAppointment,
  type DoctorAppointment,
} from "@/features/doctor/api";

const statusOf = (a: DoctorAppointment) =>
  a.cancelled
    ? { label: "ملغي", cls: "bg-error-container text-on-error-container" }
    : a.isCompleted
      ? { label: "مكتمل", cls: "bg-primary-container text-white" }
      : { label: "قادم", cls: "bg-surface-container-high text-primary" };

export default function DoctorAppointmentsPage() {
  const qc = useQueryClient();
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: getDoctorAppointments,
  });

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["doctor-appointments"] });

  const complete = useMutation({
    mutationFn: completeDoctorAppointment,
    onSuccess: invalidate,
  });
  const cancel = useMutation({
    mutationFn: cancelDoctorAppointment,
    onSuccess: invalidate,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-headline-md text-on-surface">المواعيد</h1>

      {isLoading && (
        <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
      )}

      {!isLoading && appointments.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center shadow-card">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
            event_busy
          </span>
          <p className="mt-2 text-body-md text-on-surface-variant">
            لا توجد مواعيد.
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {appointments.map((a) => {
          const st = statusOf(a);
          const busy = complete.isPending || cancel.isPending;
          return (
            <li
              key={a._id}
              className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-primary">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <p className="text-label-md text-on-surface">
                    {a.userData?.name ?? "مريض"}
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
                {!a.cancelled && !a.isCompleted && (
                  <>
                    <button
                      onClick={() => complete.mutate(a._id)}
                      disabled={busy}
                      className="rounded-lg bg-primary-container px-3 py-1.5 text-caption text-white transition-colors hover:opacity-90 disabled:opacity-40"
                    >
                      إتمام
                    </button>
                    <button
                      onClick={() => cancel.mutate(a._id)}
                      disabled={busy}
                      className="rounded-lg border border-outline-variant px-3 py-1.5 text-caption text-error transition-colors hover:bg-error-container disabled:opacity-40"
                    >
                      إلغاء
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
