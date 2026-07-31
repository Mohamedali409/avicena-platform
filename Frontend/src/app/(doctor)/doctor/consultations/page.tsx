"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDoctorConsultations,
  completeDoctorConsultation,
  cancelDoctorConsultation,
  createDoctorConsultation,
  getDoctorAppointments,
  type DoctorConsultation,
} from "@/features/doctor/api";

const statusOf = (c: DoctorConsultation) =>
  c.cancelled
    ? { label: "ملغية", cls: "bg-error-container text-on-error-container" }
    : c.isCompleted
      ? { label: "مكتملة", cls: "bg-primary-container text-white" }
      : { label: "قادمة", cls: "bg-surface-container-high text-primary" };

export default function DoctorConsultationsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    appointmentId: "",
    consultDay: "",
    consultTime: "",
    amount: "",
    notes: "",
  });

  const { data: consultations = [], isLoading } = useQuery({
    queryKey: ["doctor-consultations"],
    queryFn: getDoctorConsultations,
  });
  const { data: appointments = [] } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: getDoctorAppointments,
  });
  const completed = appointments.filter((a) => a.isCompleted && !a.cancelled);

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["doctor-consultations"] });

  const complete = useMutation({
    mutationFn: (c: DoctorConsultation) => completeDoctorConsultation(c._id, c.userId),
    onSuccess: invalidate,
  });
  const cancel = useMutation({
    mutationFn: (c: DoctorConsultation) => cancelDoctorConsultation(c._id, c.userId),
    onSuccess: invalidate,
  });

  const create = useMutation({
    mutationFn: () => {
      const appt = completed.find((a) => a._id === form.appointmentId);
      return createDoctorConsultation({
        appointmentId: form.appointmentId,
        userId: appt?.userId ?? "",
        consultDay: form.consultDay,
        consultTime: form.consultTime,
        amount: Number(form.amount) || appt?.amount || 0,
        notes: form.notes,
      });
    },
    onSuccess: () => {
      invalidate();
      setForm({ appointmentId: "", consultDay: "", consultTime: "", amount: "", notes: "" });
      setShowForm(false);
    },
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.appointmentId && form.consultDay && form.consultTime;
  const field =
    "w-full rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">الاستشارات</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1 rounded-xl bg-primary-container px-4 py-2 text-label-md text-white"
        >
          <span className="material-symbols-outlined text-[18px]">{showForm ? "close" : "add"}</span>
          {showForm ? "إغلاق" : "استشارة جديدة"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) create.mutate();
          }}
          className="space-y-4 rounded-xl bg-white p-6 shadow-card"
        >
          <div>
            <label className="mb-1 block text-label-md text-on-surface-variant">الموعد المكتمل</label>
            <select value={form.appointmentId} onChange={(e) => set("appointmentId", e.target.value)} className={field}>
              <option value="">اختر موعدًا…</option>
              {completed.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.userData?.name ?? "مريض"} — {a.slotDate} {a.slotTime}
                </option>
              ))}
            </select>
            {completed.length === 0 && (
              <p className="mt-1 text-caption text-error">لا توجد مواعيد مكتملة.</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-label-md text-on-surface-variant">يوم الاستشارة</label>
              <input type="date" value={form.consultDay} onChange={(e) => set("consultDay", e.target.value)} className={field} />
            </div>
            <div>
              <label className="mb-1 block text-label-md text-on-surface-variant">الوقت</label>
              <input type="time" value={form.consultTime} onChange={(e) => set("consultTime", e.target.value)} className={field} />
            </div>
            <div>
              <label className="mb-1 block text-label-md text-on-surface-variant">الرسوم (ج.م)</label>
              <input type="number" value={form.amount} onChange={(e) => set("amount", e.target.value)} className={field} />
            </div>
          </div>
          <textarea placeholder="ملاحظات (اختياري)" value={form.notes} onChange={(e) => set("notes", e.target.value)} className={field} rows={2} />
          {create.isError && (
            <p className="text-caption text-error">تعذّر إنشاء الاستشارة (تأكّد أن اليوم بعد موعد الكشف).</p>
          )}
          <button type="submit" disabled={!valid || create.isPending} className="w-full rounded-xl bg-primary-container py-3 text-label-md text-white disabled:opacity-40">
            {create.isPending ? "جارٍ الإنشاء…" : "إنشاء الاستشارة"}
          </button>
        </form>
      )}

      {isLoading && (
        <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
      )}
      {!isLoading && consultations.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center shadow-card">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">clinical_notes</span>
          <p className="mt-2 text-body-md text-on-surface-variant">لا توجد استشارات.</p>
        </div>
      )}

      <ul className="space-y-3">
        {consultations.map((c) => {
          const st = statusOf(c);
          const busy = complete.isPending || cancel.isPending;
          return (
            <li key={c._id} className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-primary">
                  <span className="material-symbols-outlined">clinical_notes</span>
                </div>
                <div>
                  <p className="text-label-md text-on-surface">{c.userData?.name ?? "مريض"}</p>
                  <p className="mt-1 flex items-center gap-1 text-caption text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                    {c.consultDay} — {c.consultTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-caption ${st.cls}`}>{st.label}</span>
                {!c.cancelled && !c.isCompleted && (
                  <>
                    <button onClick={() => complete.mutate(c)} disabled={busy} className="rounded-lg bg-primary-container px-3 py-1.5 text-caption text-white transition-colors hover:opacity-90 disabled:opacity-40">إتمام</button>
                    <button onClick={() => cancel.mutate(c)} disabled={busy} className="rounded-lg border border-outline-variant px-3 py-1.5 text-caption text-error transition-colors hover:bg-error-container disabled:opacity-40">إلغاء</button>
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
