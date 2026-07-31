"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/features/patient/api";
import type { MedicalReport } from "@/features/patient/api";

const dateLabel = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("ar-EG", { dateStyle: "medium" }) : "";

function ReportCard({ r }: { r: MedicalReport }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="overflow-hidden rounded-xl bg-white shadow-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 p-5 text-right"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-primary">
            <span className="material-symbols-outlined">description</span>
          </div>
          <div>
            <p className="text-label-md text-on-surface">
              {r.diagnosis || "تقرير طبي"}
            </p>
            <p className="text-caption text-on-surface-variant">
              د. {r.docData?.doctorName ?? "طبيب"} — {dateLabel(r.createdAt)}
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-outline-variant p-5 text-body-md">
          <Field label="الشكوى" value={r.complaint} />
          <Field label="الفحص" value={r.examination} />
          <Field label="التشخيص" value={r.diagnosis} />

          {r.treatment && r.treatment.length > 0 && (
            <div>
              <p className="mb-2 text-label-md text-on-surface-variant">العلاج</p>
              <ul className="space-y-2">
                {r.treatment.map((t, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-surface-container-low p-3"
                  >
                    <span className="text-on-surface">{t.name}</span>
                    <span className="text-caption text-on-surface-variant">
                      {[t.dosage, t.duration].filter(Boolean).join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {r.notes && <Field label="ملاحظات" value={r.notes} />}
          {r.nextVisit && (
            <Field label="الزيارة القادمة" value={dateLabel(r.nextVisit)} />
          )}
        </div>
      )}
    </li>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-label-md text-on-surface-variant">{label}</p>
      <p className="text-on-surface">{value}</p>
    </div>
  );
}

export default function PatientReportsPage() {
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-headline-md text-on-surface">تقاريري الطبية</h1>

      {isLoading && (
        <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
      )}

      {!isLoading && reports.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center shadow-card">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
            description
          </span>
          <p className="mt-2 text-body-md text-on-surface-variant">
            لا توجد تقارير بعد. ستظهر هنا تقارير طبيبك بعد الزيارة.
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {reports.map((r) => (
          <ReportCard key={r._id} r={r} />
        ))}
      </ul>
    </div>
  );
}
