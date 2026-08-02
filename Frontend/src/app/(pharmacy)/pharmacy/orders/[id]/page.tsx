"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPharmacyOrder,
  updateOrderStatus,
  type OrderStatus,
} from "@/features/pharmacy/api";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "جديد",
  confirmed: "مؤكّد",
  preparing: "قيد التجهيز",
  ready: "جاهز",
  out_for_delivery: "قيد التوصيل",
  completed: "مكتمل",
  cancelled: "ملغي",
};

// Allowed next actions from each status (delivery vs pickup handled at render).
const NEXT: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["out_for_delivery", "completed", "cancelled"],
  out_for_delivery: ["completed"],
  completed: [],
  cancelled: [],
};

export default function PharmacyOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["pharmacy-order", id],
    queryFn: () => getPharmacyOrder(id),
    enabled: !!id,
  });

  const mut = useMutation({
    mutationFn: (status: OrderStatus) => updateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pharmacy-order", id] });
      qc.invalidateQueries({ queryKey: ["pharmacy-orders"] });
    },
  });

  if (isLoading) return <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>;
  if (!order) return <p className="text-caption text-error">الطلب غير موجود</p>;

  const isDelivery = order.fulfillment?.method === "delivery";
  // "out_for_delivery" only applies to delivery orders; everything else stands.
  const nexts = NEXT[order.status].filter((s) =>
    s === "out_for_delivery" ? isDelivery : true,
  );

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href="/pharmacy/orders" className="inline-flex items-center gap-1 text-caption text-primary hover:underline">
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        كل الطلبات
      </Link>

      <div className="rounded-xl border border-outline-variant/40 bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-on-surface">{order.orderNumber}</h1>
            <p className="text-caption text-on-surface-variant">
              {isDelivery ? "توصيل" : "استلام من الصيدلية"} ·{" "}
              {order.payment?.method === "cod" ? "دفع عند الاستلام" : "دفع أونلاين"} (
              {order.payment?.status === "paid" ? "مدفوع" : "غير مدفوع"})
            </p>
          </div>
          <span className="rounded-full bg-surface-container-low px-3 py-1 text-label-md text-on-surface">
            {STATUS_LABEL[order.status]}
          </span>
        </div>

        {isDelivery && order.fulfillment?.address && (
          <p className="mb-4 rounded-lg bg-surface-container-low p-3 text-caption text-on-surface-variant">
            📍 {order.fulfillment.address.line1}
            {order.fulfillment.address.city ? `، ${order.fulfillment.address.city}` : ""}
            {order.fulfillment.address.phone ? ` · ${order.fulfillment.address.phone}` : ""}
          </p>
        )}

        <ul className="divide-y divide-outline-variant/40">
          {order.items?.map((it, i) => (
            <li key={i} className="flex items-center justify-between py-2.5 text-body-md">
              <span className="text-on-surface">{it.name} <span className="text-on-surface-variant">× {it.qty}</span></span>
              <span className="text-on-surface">{it.lineTotal} ج.م</span>
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

      {/* Status actions */}
      {nexts.length > 0 && (
        <div className="rounded-xl border border-outline-variant/40 bg-white p-5 shadow-card">
          <p className="mb-3 text-label-md text-on-surface">تحديث الحالة</p>
          <div className="flex flex-wrap gap-2">
            {nexts.map((s) => (
              <button
                key={s}
                onClick={() => mut.mutate(s)}
                disabled={mut.isPending}
                className={`rounded-lg px-4 py-2 text-label-md transition-all disabled:opacity-50 ${
                  s === "cancelled"
                    ? "border border-error text-error hover:bg-error-container/30"
                    : "bg-primary-container text-white hover:opacity-90"
                }`}
              >
                {s === "cancelled" ? "إلغاء الطلب" : `→ ${STATUS_LABEL[s]}`}
              </button>
            ))}
          </div>
          {mut.isError && <p className="mt-2 text-caption text-error">تعذّر تحديث الحالة</p>}
        </div>
      )}
    </div>
  );
}
