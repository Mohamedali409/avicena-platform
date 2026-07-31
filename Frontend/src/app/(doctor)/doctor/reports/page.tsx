"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDoctorReports,
  addDoctorReport,
  editDoctorReport,
  deleteDoctorReport,
  getDoctorAppointments,
  type DoctorReport,
  type ReportTreatment,
} from "@/features/doctor/api";

const dateLabel = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("ar-EG", { dateStyle: "medium" }) : "";

const emptyForm = {
  appointmentId: "",
  complaint: "",
  examination: "",
  diagnosis: "",
  notes: "",
  nextVisit: "",
};

export default function DoctorReportsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [treatment, setTreatment] = useState<ReportTreatment[]>([
    { name: "", dosage: "", duration: "" },
  ]);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["doctor-reports"],
    queryFn: getDoctorReports,
  });
  const { data: appointments = [] } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: getDoctorAppointments,
  });
  const completed = appointments.filter((a) => a.isCompleted && !a.cancelled);

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["doctor-reports"] });

  const resetForm = () => {
    setForm(emptyForm);
    setTreatment([{ name: "", dosage: "", duration: "" }]);
    setEditingId(null);
    setShowForm(false);
  };

  const save = useMutation({
    mutationFn: () => {
      const fields = {
        complaint: form.complaint,
        examination: form.examination,
        diagnosis: form.diagnosis,
        notes: form.notes,
        nextVisit: form.nextVisit,
        treatment: treatment.filter((t) => t.name.trim()),
      };
      return editingId
        ? editDoctorReport(editingId, fields)
        : addDoctorReport({ appointmentId: form.appointmentId, ...fields });
    },
    onSuccess: () => {
      invalidate();
      resetForm();
    },
  });

  const del = useMutation({
    mutationFn: deleteDoctorReport,
    onSuccess: invalidate,
  });

  const startEdit = (r: DoctorReport) => {
    setEditingId(r._id);
    setForm({
      appointmentId: "",
      complaint: r.complaint,
      examination: r.examination,
      diagnosis: r.diagnosis,
      notes: r.notes ?? "",
      nextVisit: r.nextVisit ? r.nextVisit.slice(0, 10) : "",
    });
    setTreatment(
      r.treatment?.length ? r.treatment : [{ name: "", dosage: "", duration: "" }],
    );
    setShowForm(true);
  };

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const valid =
    (editingId || form.appointmentId) &&
    form.complaint &&
    form.examination &&
    form.diagnosis;

  const field =
    "w-full rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">التقارير</h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="flex items-center gap-1 rounded-xl bg-primary-container px-4 py-2 text-label-md text-white"
        >
          <span className="material-symbols-outlined text-[18px]">
            {showForm ? "close" : "add"}
          </span>
          {showForm ? "إغلاق" : "تقرير جديد"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) save.mutate();
          }}
          className="space-y-4 rounded-xl bg-white p-6 shadow-card"
        >
          {editingId ? (
            <p className="text-label-md text-primary">تعديل التقرير</p>
          ) : (
            <div>
              <label className="mb-1 block text-label-md text-on-surface-variant">
                الموعد (المكتمل)
              </label>
              <select
                value={form.appointmentId}
                onChange={(e) => set("appointmentId", e.target.value)}
                className={field}
              >
                <option value="">اختر موعدًا…</option>
                {completed.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.userData?.name ?? "مريض"} — {a.slotDate} {a.slotTime}
                  </option>
                ))}
              </select>
              {completed.length === 0 && (
                <p className="mt-1 text-caption text-error">
                  لا توجد مواعيد مكتملة لكتابة تقرير لها.
                </p>
              )}
            </div>
          )}

          <textarea placeholder="الشكوى" value={form.complaint} onChange={(e) => set("complaint", e.target.value)} className={field} rows={2} />
          <textarea placeholder="الفحص" value={form.examination} onChange={(e) => set("examination", e.target.value)} className={field} rows={2} />
          <textarea placeholder="التشخيص" value={form.diagnosis} onChange={(e) => set("diagnosis", e.target.value)} className={field} rows={2} />

          <div className="space-y-2">
            <label className="block text-label-md text-on-surface-variant">العلاج</label>
            {treatment.map((t, i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <input placeholder="الدواء" value={t.name} onChange={(e) => setTreatment((rows) => rows.map((r, j) => (j === i ? { ...r, name: e.target.value } : r)))} className={field} />
                <input placeholder="الجرعة" value={t.dosage} onChange={(e) => setTreatment((rows) => rows.map((r, j) => (j === i ? { ...r, dosage: e.target.value } : r)))} className={field} />
                <input placeholder="المدة" value={t.duration} onChange={(e) => setTreatment((rows) => rows.map((r, j) => (j === i ? { ...r, duration: e.target.value } : r)))} className={field} />
              </div>
            ))}
            <button type="button" onClick={() => setTreatment((r) => [...r, { name: "", dosage: "", duration: "" }])} className="text-caption text-primary hover:underline">
              + إضافة دواء
            </button>
          </div>

          <textarea placeholder="ملاحظات (اختياري)" value={form.notes} onChange={(e) => set("notes", e.target.value)} className={field} rows={2} />
          <div>
            <label className="mb-1 block text-label-md text-on-surface-variant">الزيارة القادمة (اختياري)</label>
            <input type="date" value={form.nextVisit} onChange={(e) => set("nextVisit", e.target.value)} className={field} />
          </div>

          {save.isError && (
            <p className="text-caption text-error">تعذّر حفظ التقرير، تأكّد من البيانات.</p>
          )}
          <button type="submit" disabled={!valid || save.isPending} className="w-full rounded-xl bg-primary-container py-3 text-label-md text-white disabled:opacity-40">
            {save.isPending ? "جارٍ الحفظ…" : editingId ? "حفظ التعديل" : "حفظ التقرير"}
          </button>
        </form>
      )}

      {isLoading && (
        <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
      )}
      {!isLoading && reports.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center shadow-card">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">description</span>
          <p className="mt-2 text-body-md text-on-surface-variant">لا توجد تقارير بعد.</p>
        </div>
      )}

      <ul className="space-y-3">
        {reports.map((r) => (
          <ReportCard
            key={r._id}
            r={r}
            onEdit={() => startEdit(r)}
            onDelete={() => del.mutate(r._id)}
            deleting={del.isPending}
          />
        ))}
      </ul>
    </div>
  );
}

function ReportCard({
  r,
  onEdit,
  onDelete,
  deleting,
}: {
  r: DoctorReport;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li className="overflow-hidden rounded-xl bg-white shadow-card">
      <div className="flex items-center justify-between gap-2 p-5">
        <button onClick={() => setOpen((o) => !o)} className="flex flex-1 items-center gap-4 text-right">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-primary">
            <span className="material-symbols-outlined">description</span>
          </div>
          <div>
            <p className="text-label-md text-on-surface">{r.userData?.name ?? "مريض"}</p>
            <p className="text-caption text-on-surface-variant">{r.diagnosis} — {dateLabel(r.createdAt)}</p>
          </div>
        </button>
        <div className="flex items-center gap-1">
          <button onClick={onEdit} className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-primary" aria-label="تعديل">
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
          <button onClick={onDelete} disabled={deleting} className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-error-container hover:text-error disabled:opacity-40" aria-label="حذف">
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </div>
      {open && (
        <div className="space-y-3 border-t border-outline-variant p-5 text-body-md">
          <p><span className="text-on-surface-variant">الشكوى: </span>{r.complaint}</p>
          <p><span className="text-on-surface-variant">الفحص: </span>{r.examination}</p>
          <p><span className="text-on-surface-variant">التشخيص: </span>{r.diagnosis}</p>
          {r.treatment && r.treatment.length > 0 && (
            <div>
              <p className="text-on-surface-variant">العلاج:</p>
              <ul className="mt-1 space-y-1">
                {r.treatment.map((t, i) => (
                  <li key={i} className="rounded-lg bg-surface-container-low p-2 text-caption">
                    {t.name} {[t.dosage, t.duration].filter(Boolean).join(" · ")}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {r.notes && <p><span className="text-on-surface-variant">ملاحظات: </span>{r.notes}</p>}
          {r.nextVisit && <p><span className="text-on-surface-variant">الزيارة القادمة: </span>{dateLabel(r.nextVisit)}</p>}
        </div>
      )}
    </li>
  );
}
