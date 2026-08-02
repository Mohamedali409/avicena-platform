"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { searchByReport, type MatchRow } from "@/features/pharmacy/api";
import { useCart } from "@/features/pharmacy/cart.store";

export default function ReportDispensePage() {
  const { reportId } = useParams<{ reportId: string }>();
  const cart = useCart();
  const count = cart.count();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["report-dispense", reportId],
    queryFn: () => searchByReport(reportId),
    enabled: !!reportId,
  });

  const addRow = (r: MatchRow) =>
    cart.add(r.pharmacy._id, r.pharmacy.pharmacyName, {
      productId: r.product._id,
      name: r.product.name,
      price: r.price,
    });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/patient/reports" className="text-caption text-primary hover:underline">
            ← التقارير
          </Link>
          <h1 className="text-2xl font-bold text-on-surface">صرف أدوية التقرير</h1>
        </div>
        <Link href="/patient/cart" className="relative flex items-center gap-1.5 rounded-lg border border-outline-variant px-4 py-2 text-label-md text-primary hover:bg-surface-container-low">
          <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
          السلة
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">{count}</span>
          )}
        </Link>
      </div>

      {isLoading ? (
        <p className="text-center text-caption text-on-surface-variant">جارٍ البحث…</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl bg-surface-container-low p-6 text-center text-caption text-on-surface-variant">
          لا توجد أدوية في هذا التقرير
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((it, idx) => {
            const rows = it.available.length > 0 ? it.available : it.alternatives;
            const isAlt = it.available.length === 0 && it.alternatives.length > 0;
            return (
              <div key={idx} className="rounded-xl border border-outline-variant/40 bg-white p-4 shadow-card">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-label-lg font-bold text-on-surface">{it.medicine}</p>
                  <span className="text-caption text-on-surface-variant">
                    {[it.dosage, it.duration].filter(Boolean).join(" · ")}
                  </span>
                </div>

                {rows.length === 0 ? (
                  <p className="rounded-lg bg-surface-container-low p-3 text-caption text-error">غير متوفّر ولا يوجد بديل</p>
                ) : (
                  <>
                    {isAlt && <p className="mb-2 text-caption text-amber-600">غير متوفّر — بدائل بنفس المادة الفعّالة:</p>}
                    <ul className="space-y-2">
                      {rows.map((r) => (
                        <li key={r.inventoryId} className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${isAlt ? "border-amber-300 bg-amber-50" : "border-outline-variant/40"}`}>
                          <div className="min-w-0">
                            <p className="text-label-md text-on-surface">{r.product.name}</p>
                            <p className="truncate text-caption text-on-surface-variant">{r.pharmacy.pharmacyName} · مخزون {r.stock}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-label-md">{r.price} ج.م</span>
                            <button onClick={() => addRow(r)} disabled={r.stock <= 0}
                              className="rounded-lg bg-primary-container px-3 py-1.5 text-caption text-white transition-all hover:opacity-90 disabled:opacity-40">
                              أضف
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
