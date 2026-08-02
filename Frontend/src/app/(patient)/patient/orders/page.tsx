"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMyOrders, type OrderStatus } from "@/features/pharmacy/api";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "قيد المراجعة",
  confirmed: "مؤكّد",
  preparing: "قيد التجهيز",
  ready: "جاهز",
  out_for_delivery: "قيد التوصيل",
  completed: "مكتمل",
  cancelled: "ملغي",
};

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-blue-100 text-blue-700",
  ready: "bg-teal-100 text-teal-700",
  out_for_delivery: "bg-teal-100 text-teal-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function PatientOrdersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold text-on-surface">طلباتي</h1>

      <div className="overflow-hidden rounded-xl border border-outline-variant/40 bg-white shadow-card">
        {isLoading ? (
          <p className="p-8 text-center text-caption text-on-surface-variant">جارٍ التحميل…</p>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-caption text-on-surface-variant">لا توجد طلبات بعد</p>
            <Link href="/patient/pharmacies" className="mt-2 inline-block text-primary hover:underline">
              اطلب دواء الآن
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant/40">
            {orders.map((o) => (
              <li key={o._id}>
                <Link href={`/patient/orders/${o._id}`} className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-surface-container-low">
                  <div className="min-w-0">
                    <p className="text-label-md text-on-surface">{o.orderNumber}</p>
                    <p className="truncate text-caption text-on-surface-variant">
                      {o.items?.length ?? 0} صنف · {new Date(o.createdAt).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-label-md text-on-surface">{o.total} ج.م</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_CLASS[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
