"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyOrder, cancelMyOrder, type OrderStatus } from "@/features/pharmacy/api";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "قيد المراجعة" },
  { key: "confirmed", label: "مؤكّد" },
  { key: "preparing", label: "قيد التجهيز" },
  { key: "ready", label: "جاهز" },
  { key: "out_for_delivery", label: "قيد التوصيل" },
  { key: "completed", label: "مكتمل" },
];

export default function PatientOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["my-order", id],
    queryFn: () => getMyOrder(id),
    enabled: !!id,
  });

  const cancelMut = useMutation({
    mutationFn: () => cancelMyOrder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-order", id] });
      qc.invalidateQueries({ queryKey: ["my-orders"] });
    },
  });

  if (isLoading) return <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>;
  if (!order) return <p className="text-caption text-error">الطلب غير موجود</p>;

  const cancellable = order.status === "pending" || order.status === "confirmed";
  const stepIndex = STEPS.findIndex((s) => s.key === order.status);
  const isDelivery = order.fulfillment?.method === "delivery";

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href="/patient/orders" className="inline-flex items-center gap-1 text-caption text-primary hover:underline">
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        طلباتي
      </Link>

      <div className="rounded-xl border border-outline-variant/40 bg-white p-5 shadow-card">
        <h1 className="text-xl font-bold text-on-surface">{order.orderNumber}</h1>
        <p className="text-caption text-on-surface-variant">
          {isDelivery ? "توصيل" : "استلام"} ·{" "}
          {order.payment?.method === "cod" ? "دفع عند الاستلام" : "دفع أونلاين"}
        </p>

        {/* Progress */}
        {order.status !== "cancelled" ? (
          <div className="mt-5 flex items-center justify-between">
            {STEPS.filter((s) => s.key !== "out_for_delivery" || isDelivery).map((s, i, arr) => {
              const done = STEPS.findIndex((x) => x.key === s.key) <= stepIndex;
              return (
                <div key={s.key} className="flex flex-1 flex-col items-center">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] ${done ? "bg-primary-container text-white" : "bg-surface-container-low text-on-surface-variant"}`}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span className="mt-1 text-[10px] text-on-surface-variant">{s.label}</span>
                  {i < arr.length - 1 && <span className="sr-only">-</span>}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 rounded-lg bg-error-container p-3 text-caption text-on-error-container">تم إلغاء هذا الطلب</p>
        )}
      </div>

      <div className="rounded-xl border border-outline-variant/40 bg-white p-5 shadow-card">
        <ul className="divide-y divide-outline-variant/40">
          {order.items?.map((it, i) => (
            <li key={i} className="flex items-center justify-between py-2.5 text-body-md">
              <span className="text-on-surface">{it.name} <span className="text-on-surface-variant">× {it.qty}</span></span>
              <span>{it.lineTotal} ج.م</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-outline-variant/40 pt-4 text-body-md">
          <div className="flex justify-between text-on-surface-variant"><span>الإجمالي الفرعي</span><span>{order.subtotal} ج.م</span></div>
          {order.discount > 0 && <div className="flex justify-between text-on-surface-variant"><span>الخصم</span><span>- {order.discount} ج.م</span></div>}
          {order.deliveryFee > 0 && <div className="flex justify-between text-on-surface-variant"><span>التوصيل</span><span>{order.deliveryFee} ج.م</span></div>}
          <div className="flex justify-between text-label-lg font-bold text-on-surface"><span>الإجمالي</span><span>{order.total} ج.م</span></div>
        </div>
      </div>

      {cancellable && (
        <button onClick={() => cancelMut.mutate()} disabled={cancelMut.isPending}
          className="w-full rounded-lg border border-error py-2.5 text-label-md text-error transition-colors hover:bg-error-container/30 disabled:opacity-50">
          {cancelMut.isPending ? "جارٍ الإلغاء…" : "إلغاء الطلب"}
        </button>
      )}
    </div>
  );
}
