"use client";

import { useState } from "react";
import Link from "next/link";
import { searchMedicine, type MatchRow } from "@/features/pharmacy/api";
import { useCart } from "@/features/pharmacy/cart.store";

export default function PatientPharmaciesPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [available, setAvailable] = useState<MatchRow[]>([]);
  const [alternatives, setAlternatives] = useState<MatchRow[]>([]);

  const cart = useCart();
  const count = cart.count();

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (term.length < 2) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await searchMedicine(term);
      setAvailable(res.available);
      setAlternatives(res.alternatives);
    } catch {
      setAvailable([]);
      setAlternatives([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">الصيدليات</h1>
          <p className="text-on-surface-variant">ابحث عن دواء لتعرف الصيدليات المتاحة</p>
        </div>
        <Link
          href="/patient/cart"
          className="relative flex items-center gap-1.5 rounded-lg border border-outline-variant px-4 py-2 text-label-md text-primary hover:bg-surface-container-low"
        >
          <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
          السلة
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>

      <form onSubmit={run} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="اسم الدواء أو المادة الفعّالة…"
          className="flex-1 rounded-full border border-outline-variant bg-surface-container-low px-5 py-3 outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="rounded-full bg-primary-container px-6 text-white transition-all hover:opacity-90"
        >
          بحث
        </button>
      </form>

      {loading && <p className="text-center text-caption text-on-surface-variant">جارٍ البحث…</p>}

      {!loading && searched && (
        <div className="space-y-6">
          <Section
            title="متوفّر في"
            empty="غير متوفّر في أي صيدلية"
            rows={available}
            onAdd={(r) => cart.add(r.pharmacy._id, r.pharmacy.pharmacyName, { productId: r.product._id, name: r.product.name, price: r.price })}
          />
          {available.length === 0 && alternatives.length > 0 && (
            <Section
              title="بدائل مقترحة (نفس المادة الفعّالة)"
              empty=""
              rows={alternatives}
              highlight
              onAdd={(r) => cart.add(r.pharmacy._id, r.pharmacy.pharmacyName, { productId: r.product._id, name: r.product.name, price: r.price })}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  empty,
  rows,
  onAdd,
  highlight,
}: {
  title: string;
  empty: string;
  rows: MatchRow[];
  onAdd: (r: MatchRow) => void;
  highlight?: boolean;
}) {
  if (rows.length === 0 && !empty) return null;
  return (
    <div>
      <h2 className="mb-2 text-label-lg font-bold text-on-surface">{title}</h2>
      {rows.length === 0 ? (
        <p className="rounded-xl bg-surface-container-low p-4 text-caption text-on-surface-variant">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li
              key={r.inventoryId}
              className={`flex items-center justify-between gap-3 rounded-xl border p-4 ${
                highlight ? "border-amber-300 bg-amber-50" : "border-outline-variant/40 bg-white"
              }`}
            >
              <div className="min-w-0">
                <p className="text-label-md text-on-surface">{r.product.name}</p>
                <p className="truncate text-caption text-on-surface-variant">
                  {r.product.activeIngredient ? `${r.product.activeIngredient} · ` : ""}
                  {r.pharmacy.pharmacyName} · مخزون {r.stock}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-label-md text-on-surface">{r.price} ج.م</span>
                <button
                  onClick={() => onAdd(r)}
                  disabled={r.stock <= 0}
                  className="rounded-lg bg-primary-container px-3 py-1.5 text-caption text-white transition-all hover:opacity-90 disabled:opacity-40"
                >
                  أضف
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
