"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminAppointments,
  cancelAdminAppointment,
  completeAdminAppointment,
  type AdminAppointment,
} from "@/features/admin/api";

const statusOf = (a: AdminAppointment) =>
  a.cancelled
    ? { label: "ملغي", cls: "bg-error-container text-on-error-container" }
    : a.isCompleted
      ? { label: "مكتمل", cls: "bg-primary-container text-white" }
      : { label: "قادم", cls: "bg-surface-container-high text-primary" };

export default function AdminAppointmentsPage() {
  const qc = useQueryClient();
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: getAdminAppointments,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-appointments"] });
  const cancel = useMutation({ mutationFn: cancelAdminAppointment, onSuccess: invalidate });
  const complete = useMutation({ mutationFn: completeAdminAppointment, onSuccess: invalidate });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-headline-md text-on-surface">جميع المواعيد ({appointments.length})</h1>

      {isLoading && <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>}

      <div className="overflow-hidden rounded-xl bg-white shadow-card">
        <table className="w-full text-right text-body-md">
          <thead className="border-b border-outline-variant bg-surface-container-low text-label-md text-on-surface-variant">
            <tr>
              <th className="p-4 font-medium">المريض</th>
              <th className="p-4 font-medium">الطبيب</th>
              <th className="p-4 font-medium">الموعد</th>
              <th className="p-4 font-medium">الحالة</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {appointments.map((a) => {
              const st = statusOf(a);
              const busy = cancel.isPending || complete.isPending;
              return (
                <tr key={a._id} className="hover:bg-surface-container-low">
                  <td className="p-4 text-on-surface">{a.userData?.name ?? "—"}</td>
                  <td className="p-4 text-on-surface-variant">د. {a.docData?.doctorName ?? "—"}</td>
                  <td className="p-4 text-caption text-on-surface-variant">{a.slotDate} — {a.slotTime}</td>
                  <td className="p-4"><span className={`rounded-full px-3 py-1 text-caption ${st.cls}`}>{st.label}</span></td>
                  <td className="p-4">
                    {!a.cancelled && !a.isCompleted && (
                      <div className="flex gap-2">
                        <button onClick={() => complete.mutate(a)} disabled={busy} className="rounded-lg bg-primary-container px-3 py-1.5 text-caption text-white disabled:opacity-40">إتمام</button>
                        <button onClick={() => cancel.mutate(a._id)} disabled={busy} className="rounded-lg border border-outline-variant px-3 py-1.5 text-caption text-error disabled:opacity-40">إلغاء</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!isLoading && appointments.length === 0 && (
          <p className="p-8 text-center text-caption text-on-surface-variant">لا توجد مواعيد.</p>
        )}
      </div>
    </div>
  );
}
