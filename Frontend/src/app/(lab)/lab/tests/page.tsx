"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getLabProfile } from "@/features/labs/portal.api";

export default function LabTestsPage() {
  const { data: lab, isLoading } = useQuery({
    queryKey: ["lab-profile"],
    queryFn: getLabProfile,
  });

  const tests = lab?.tests ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">قائمة التحاليل</h1>
        <Link
          href="/lab/profile"
          className="flex items-center gap-1 rounded-xl border border-outline-variant px-4 py-2 text-label-md text-primary transition-colors hover:bg-surface-container-low"
        >
          <span className="material-symbols-outlined text-[18px]">biotech</span>
          ملف المعمل
        </Link>
      </div>

      {isLoading && (
        <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
      )}

      {!isLoading && tests.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center shadow-card">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
            labs
          </span>
          <p className="mt-2 text-body-md text-on-surface-variant">
            لم تُضِف أي تحاليل بعد. أضِفها من ملف المعمل.
          </p>
        </div>
      )}

      {tests.length > 0 && (
        <div className="overflow-hidden rounded-xl bg-white shadow-card">
          <table className="w-full text-right text-body-md">
            <thead className="border-b border-outline-variant bg-surface-container-low text-label-md text-on-surface-variant">
              <tr>
                <th className="p-4 font-medium">التحليل</th>
                <th className="p-4 font-medium">المدة</th>
                <th className="p-4 font-medium">السعر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {tests.map((t, i) => (
                <tr key={i} className="hover:bg-surface-container-low">
                  <td className="p-4">
                    <p className="text-on-surface">{t.name}</p>
                    {t.description && (
                      <p className="text-caption text-on-surface-variant">
                        {t.description}
                      </p>
                    )}
                  </td>
                  <td className="p-4 text-on-surface-variant">{t.duration ?? "—"}</td>
                  <td className="p-4 font-medium text-primary">
                    {t.price?.toLocaleString("ar-EG")} ج.م
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
