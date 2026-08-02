"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listCoupons,
  createCoupon,
  deleteCoupon,
  type CreateCouponInput,
} from "@/features/pharmacy/api";

const todayPlus = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const EMPTY: CreateCouponInput = {
  code: "",
  type: "percentage",
  value: 10,
  validTo: todayPlus(30),
  minOrder: 0,
  maxDiscount: 0,
  maxUses: 0,
  maxUsesPerUser: 1,
  scope: "all",
};

export default function PharmacyCouponsPage() {
  const qc = useQueryClient();
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["pharmacy-coupons"],
    queryFn: listCoupons,
  });

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<CreateCouponInput>(EMPTY);
  const [error, setError] = useState("");

  const invalidate = () => qc.invalidateQueries({ queryKey: ["pharmacy-coupons"] });

  const createMut = useMutation({
    mutationFn: (input: CreateCouponInput) => createCoupon(input),
    onSuccess: () => {
      setShowAdd(false);
      setForm(EMPTY);
      invalidate();
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "تعذّر إنشاء الكوبون");
    },
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteCoupon(id),
    onSuccess: invalidate,
  });

  const field = "w-full rounded-lg border border-outline-variant px-3 py-2 outline-none focus:border-primary";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">الكوبونات</h1>
          <p className="text-on-surface-variant">أنشئ أكواد خصم لعملائك</p>
        </div>
        <button
          onClick={() => { setShowAdd((s) => !s); setError(""); }}
          className="flex items-center gap-1.5 rounded-lg bg-primary-container px-4 py-2 text-label-md text-white transition-all hover:opacity-90"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          كوبون جديد
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={(e) => { e.preventDefault(); setError(""); createMut.mutate({ ...form, value: Number(form.value) }); }}
          className="grid gap-3 rounded-xl border border-outline-variant/40 bg-white p-5 shadow-card sm:grid-cols-2 lg:grid-cols-3"
        >
          <label className="space-y-1">
            <span className="text-caption text-on-surface-variant">الكود</span>
            <input required className={`${field} uppercase`} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SUMMER20" />
          </label>
          <label className="space-y-1">
            <span className="text-caption text-on-surface-variant">النوع</span>
            <select className={field} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })}>
              <option value="percentage">نسبة %</option>
              <option value="fixed">مبلغ ثابت</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-caption text-on-surface-variant">القيمة</span>
            <input required type="number" min={1} className={field} value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
          </label>
          <label className="space-y-1">
            <span className="text-caption text-on-surface-variant">حد أدنى للطلب</span>
            <input type="number" min={0} className={field} value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} />
          </label>
          <label className="space-y-1">
            <span className="text-caption text-on-surface-variant">أقصى خصم (لـ %)</span>
            <input type="number" min={0} className={field} value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })} />
          </label>
          <label className="space-y-1">
            <span className="text-caption text-on-surface-variant">تاريخ الانتهاء</span>
            <input required type="date" className={field} value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-caption text-on-surface-variant">عدد مرات الاستخدام (0 = بلا حد)</span>
            <input type="number" min={0} className={field} value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })} />
          </label>
          <label className="space-y-1">
            <span className="text-caption text-on-surface-variant">لكل مستخدم</span>
            <input type="number" min={1} className={field} value={form.maxUsesPerUser} onChange={(e) => setForm({ ...form, maxUsesPerUser: Number(e.target.value) })} />
          </label>
          <div className="flex items-end">
            <button type="submit" disabled={createMut.isPending} className="w-full rounded-lg bg-primary-container py-2 text-white disabled:opacity-50">
              {createMut.isPending ? "..." : "إنشاء"}
            </button>
          </div>
          {error && <p className="col-span-full text-caption text-error">{error}</p>}
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-outline-variant/40 bg-white shadow-card">
        {isLoading ? (
          <p className="p-8 text-center text-caption text-on-surface-variant">جارٍ التحميل…</p>
        ) : coupons.length === 0 ? (
          <p className="p-8 text-center text-caption text-on-surface-variant">لا توجد كوبونات</p>
        ) : (
          <ul className="divide-y divide-outline-variant/40">
            {coupons.map((c) => (
              <li key={c._id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-mono text-label-md font-bold text-on-surface">{c.code}</p>
                  <p className="text-caption text-on-surface-variant">
                    {c.type === "percentage" ? `${c.value}%` : `${c.value} ج.م`}
                    {c.minOrder ? ` · حد أدنى ${c.minOrder}` : ""} · ينتهي {new Date(c.validTo).toLocaleDateString("ar-EG")}
                    {typeof c.usedCount === "number" ? ` · استُخدم ${c.usedCount}` : ""}
                  </p>
                </div>
                <button onClick={() => delMut.mutate(c._id)} className="text-error hover:opacity-70" aria-label="حذف">
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
