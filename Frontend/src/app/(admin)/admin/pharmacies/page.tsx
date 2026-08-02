"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listApplications,
  approveApplication,
  rejectApplication,
  type PharmacyApplication,
} from "@/features/pharmacy/api";

const STATUS: Record<PharmacyApplication["status"], { label: string; cls: string }> = {
  pending: { label: "قيد المراجعة", cls: "bg-amber-100 text-amber-700" },
  approved: { label: "مقبول", cls: "bg-green-100 text-green-700" },
  rejected: { label: "مرفوض", cls: "bg-red-100 text-red-700" },
};

export default function AdminPharmaciesPage() {
  const qc = useQueryClient();
  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["pharmacy-applications"],
    queryFn: listApplications,
  });

  const [rejecting, setRejecting] = useState<PharmacyApplication | null>(null);
  const [reason, setReason] = useState("");

  const invalidate = () => qc.invalidateQueries({ queryKey: ["pharmacy-applications"] });

  const approveMut = useMutation({
    mutationFn: (id: string) => approveApplication(id),
    onSuccess: invalidate,
  });
  const rejectMut = useMutation({
    mutationFn: ({ id, r }: { id: string; r: string }) => rejectApplication(id, r),
    onSuccess: () => {
      setRejecting(null);
      setReason("");
      invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">طلبات الصيدليات</h1>
        <p className="text-on-surface-variant">راجع طلبات التسجيل ووافق أو ارفض</p>
      </div>

      {isLoading ? (
        <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
      ) : apps.length === 0 ? (
        <p className="rounded-xl border border-outline-variant/40 bg-white p-8 text-center text-caption text-on-surface-variant shadow-card">
          لا توجد طلبات
        </p>
      ) : (
        <div className="space-y-3">
          {apps.map((a) => (
            <div key={a._id} className="rounded-xl border border-outline-variant/40 bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-label-lg font-bold text-on-surface">{a.pharmacyName}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS[a.status].cls}`}>
                      {STATUS[a.status].label}
                    </span>
                  </div>
                  <p className="mt-1 text-caption text-on-surface-variant">
                    {a.ownerName} · {a.email} · {a.phone}
                  </p>
                  <p className="text-caption text-on-surface-variant">
                    ترخيص: {a.licenseNumber}
                    {a.address?.city ? ` · ${a.address.city}` : ""}
                  </p>
                  {a.status === "rejected" && a.rejectReason && (
                    <p className="mt-1 text-caption text-error">سبب الرفض: {a.rejectReason}</p>
                  )}
                </div>

                {a.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveMut.mutate(a._id)}
                      disabled={approveMut.isPending}
                      className="rounded-lg bg-primary-container px-4 py-2 text-label-md text-white transition-all hover:opacity-90 disabled:opacity-50"
                    >
                      موافقة
                    </button>
                    <button
                      onClick={() => setRejecting(a)}
                      className="rounded-lg border border-error px-4 py-2 text-label-md text-error transition-colors hover:bg-error-container/30"
                    >
                      رفض
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject reason modal */}
      {rejecting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setRejecting(null)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-card-hover" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-3 text-headline-sm text-on-surface">رفض طلب {rejecting.pharmacyName}</h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="سبب الرفض"
              className="h-24 w-full rounded-lg border border-outline-variant p-3 outline-none focus:border-primary"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setRejecting(null)} className="rounded-lg px-4 py-2 text-label-md text-on-surface-variant hover:bg-surface-container-low">
                إلغاء
              </button>
              <button
                onClick={() => rejectMut.mutate({ id: rejecting._id, r: reason })}
                disabled={rejectMut.isPending}
                className="rounded-lg bg-error px-4 py-2 text-label-md text-white disabled:opacity-50"
              >
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
