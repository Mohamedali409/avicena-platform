"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminLabs } from "@/features/admin/api";

export default function AdminLabsPage() {
  const { data: labs = [], isLoading } = useQuery({
    queryKey: ["admin-labs"],
    queryFn: getAdminLabs,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-headline-md text-on-surface">المعامل ({labs.length})</h1>

      {isLoading && <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>}

      <ul className="space-y-2">
        {labs.map((l) => (
          <li key={l._id} className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-primary">
                <span className="material-symbols-outlined">biotech</span>
              </div>
              <div>
                <p className="text-label-md text-on-surface">{l.name}</p>
                <p className="text-caption text-on-surface-variant">
                  {l.email} {l.address?.city ? `· ${l.address.city}` : ""}
                </p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-caption ${l.isVerified ? "bg-green-100 text-green-700" : "bg-surface-container-high text-on-surface-variant"}`}>
              {l.isVerified ? "موثّق" : "قيد المراجعة"}
            </span>
          </li>
        ))}
      </ul>
      {!isLoading && labs.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center shadow-card">
          <p className="text-body-md text-on-surface-variant">لا توجد معامل.</p>
        </div>
      )}
    </div>
  );
}
