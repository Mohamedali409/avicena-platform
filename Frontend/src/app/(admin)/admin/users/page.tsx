"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, toggleUserStatus } from "@/features/admin/api";

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
  });

  const toggle = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.phone?.includes(term),
    );
  }, [users, q]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-headline-md text-on-surface">المستخدمون ({users.length})</h1>
        <div className="flex items-center gap-2 rounded-xl border border-outline-variant bg-white px-4 py-2">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث بالاسم/الإيميل/الهاتف…" className="bg-transparent text-body-md outline-none" />
        </div>
      </div>

      {isLoading && <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>}

      <div className="overflow-hidden rounded-xl bg-white shadow-card">
        <table className="w-full text-right text-body-md">
          <thead className="border-b border-outline-variant bg-surface-container-low text-label-md text-on-surface-variant">
            <tr>
              <th className="p-4 font-medium">الاسم</th>
              <th className="p-4 font-medium">الإيميل</th>
              <th className="p-4 font-medium">الحالة</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filtered.map((u) => (
              <tr key={u._id} className="hover:bg-surface-container-low">
                <td className="p-4 text-on-surface">{u.name ?? "—"}</td>
                <td className="p-4 text-on-surface-variant">{u.email}</td>
                <td className="p-4">
                  <span className={`rounded-full px-3 py-1 text-caption ${u.isActive === false ? "bg-error-container text-on-error-container" : "bg-green-100 text-green-700"}`}>
                    {u.isActive === false ? "محظور" : "نشط"}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => toggle.mutate(u._id)} disabled={toggle.isPending} className="rounded-lg border border-outline-variant px-3 py-1.5 text-caption transition-colors hover:bg-surface-container-low disabled:opacity-40">
                    {u.isActive === false ? "إلغاء الحظر" : "حظر"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && filtered.length === 0 && (
          <p className="p-8 text-center text-caption text-on-surface-variant">لا يوجد مستخدمون.</p>
        )}
      </div>
    </div>
  );
}
