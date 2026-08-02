"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getPharmacyOrders, type OrderStatus } from "@/features/pharmacy/api";

const TABS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "جديدة" },
  { key: "confirmed", label: "مؤكّدة" },
  { key: "preparing", label: "قيد التجهيز" },
  { key: "ready", label: "جاهزة" },
  { key: "out_for_delivery", label: "قيد التوصيل" },
  { key: "completed", label: "مكتملة" },
  { key: "cancelled", label: "ملغية" },
];

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "جديد",
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

export default function PharmacyOrdersPage() {
  const [tab, setTab] = useState<OrderStatus | "all">("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["pharmacy-orders", tab],
    queryFn: () => getPharmacyOrders(tab === "all" ? undefined : tab),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-on-surface">الطلبات</h1>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-label-md transition-colors ${
              tab === t.key
                ? "bg-primary-container text-white"
                : "border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant/40 bg-white shadow-card">
        {isLoading ? (
          <p className="p-8 text-center text-caption text-on-surface-variant">جارٍ التحميل…</p>
        ) : orders.length === 0 ? (
          <p className="p-8 text-center text-caption text-on-surface-variant">لا توجد طلبات</p>
        ) : (
          <ul className="divide-y divide-outline-variant/40">
            {orders.map((o) => (
              <li key={o._id}>
                <Link
                  href={`/pharmacy/orders/${o._id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-surface-container-low"
                >
                  <div className="min-w-0">
                    <p className="text-label-md text-on-surface">{o.orderNumber}</p>
                    <p className="truncate text-caption text-on-surface-variant">
                      {o.items?.length ?? 0} صنف ·{" "}
                      {o.fulfillment?.method === "delivery" ? "توصيل" : "استلام"} ·{" "}
                      {new Date(o.createdAt).toLocaleDateString("ar-EG")}
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
