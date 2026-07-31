"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminReports, deleteAdminReport } from "@/features/admin/api";

const dateLabel = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("ar-EG", { dateStyle: "medium" }) : "";

export default function AdminReportsPage() {
  const qc = useQueryClient();
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: getAdminReports,
  });
  const del = useMutation({
    mutationFn: deleteAdminReport,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reports"] }),
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-headline-md text-on-surface">التقارير ({reports.length})</h1>

      {isLoading && <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>}

      <ul className="space-y-2">
        {reports.map((r) => (
          <li key={r._id} className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-primary">
                <span className="material-symbols-outlined">description</span>
              </div>
              <div>
                <p className="text-label-md text-on-surface">{r.userData?.name ?? "مريض"}</p>
                <p className="text-caption text-on-surface-variant">
                  د. {r.docData?.doctorName ?? "—"} · {r.diagnosis} · {dateLabel(r.createdAt)}
                </p>
              </div>
            </div>
            <button onClick={() => del.mutate(r._id)} disabled={del.isPending} className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-error-container hover:text-error disabled:opacity-40" aria-label="حذف">
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </li>
        ))}
      </ul>
      {!isLoading && reports.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center shadow-card">
          <p className="text-body-md text-on-surface-variant">لا توجد تقارير.</p>
        </div>
      )}
    </div>
  );
}
