"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getPharmacyOrders, listInventory } from "@/features/pharmacy/api";
import type { Order, OrderStatus } from "@/features/pharmacy/api";

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

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-outline-variant/40 bg-white p-5 shadow-card">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/10 text-primary-container">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <p className="text-caption text-on-surface-variant">{label}</p>
      <p className="text-2xl font-bold text-on-surface">{value}</p>
    </div>
  );
}

export default function PharmacyDashboardPage() {
  const { data: orders = [] } = useQuery({
    queryKey: ["pharmacy-orders"],
    queryFn: () => getPharmacyOrders(),
  });
  const { data: inv } = useQuery({
    queryKey: ["pharmacy-inventory-count"],
    queryFn: () => listInventory(1, 1),
  });

  const pending = orders.filter((o) => o.status === "pending").length;
  const active = orders.filter((o) =>
    ["confirmed", "preparing", "ready", "out_for_delivery"].includes(o.status),
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">لوحة تحكم الصيدلية</h1>
        <p className="text-on-surface-variant">نظرة سريعة على طلباتك ومخزونك</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="fiber_new" label="طلبات جديدة" value={pending} />
        <StatCard icon="local_shipping" label="قيد التنفيذ" value={active} />
        <StatCard icon="receipt_long" label="إجمالي الطلبات" value={orders.length} />
        <StatCard icon="inventory_2" label="أصناف المخزون" value={inv?.total ?? 0} />
      </div>

      <div className="rounded-xl border border-outline-variant/40 bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-label-lg font-bold text-on-surface">أحدث الطلبات</h2>
          <Link
            href="/pharmacy/orders"
            className="text-caption text-primary hover:underline"
          >
            عرض الكل
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="py-8 text-center text-caption text-on-surface-variant">
            لا توجد طلبات بعد
          </p>
        ) : (
          <ul className="divide-y divide-outline-variant/40">
            {orders.slice(0, 6).map((o: Order) => (
              <li key={o._id}>
                <Link
                  href={`/pharmacy/orders/${o._id}`}
                  className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-surface-container-low"
                >
                  <div className="min-w-0">
                    <p className="text-label-md text-on-surface">
                      {o.orderNumber}
                    </p>
                    <p className="truncate text-caption text-on-surface-variant">
                      {o.items?.length ?? 0} صنف ·{" "}
                      {o.fulfillment?.method === "delivery" ? "توصيل" : "استلام"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-label-md text-on-surface">
                      {o.total} ج.م
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_CLASS[o.status]}`}
                    >
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
