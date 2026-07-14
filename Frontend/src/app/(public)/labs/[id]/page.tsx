/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { MobileBottomNav } from "@/components/public/MobileBottomNav";
import { getLabById, type Lab, type LabTest } from "@/features/labs/api";

const FALLBACK_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB4TpUL3jVd8WJbhHv5xw4tFKO0xhGobewpYa81Yvwi2G5RRzTCBMXyIHghdptV5-7xhzHyUxTE6KDgXr9pXlCLKXKb93fn_GoMBjhMVX1DmWmO82dCZnzxcOHsUEBqgW8FKcr8mQHyXDGdBiGBzHVkATLoVl-Jn6wQAJ3OKiy7dfwbb8VgBCT4Yuua9aUzmtOYP7TFdaFmxpd4_SA83-rEhx8PsR4i8CHiMqAkOcf2a2rGVhyMDKZAWzGC0-GUVhvvnnIS1GzU3-k";

const SAMPLE: Lab = {
  _id: "sample",
  name: "مختبرات البرج",
  address: { line1: "القاهرة، مدينة نصر", city: "القاهرة" },
  phone: "0225012345",
  workingHours: { from: "08:00", to: "22:00" },
  isVerified: true,
  tests: [
    { name: "صورة دم كاملة (CBC)", price: 80, duration: "ساعتان", description: "تحليل شامل لخلايا الدم" },
    { name: "سكر صائم", price: 40, duration: "ساعة", description: "قياس الجلوكوز أثناء الصيام" },
    { name: "وظائف كبد (LFT)", price: 130, duration: "3 ساعات", description: "ALT, AST, بيليروبين" },
    { name: "وظائف كلى", price: 130, duration: "3 ساعات", description: "كرياتينين، يوريا، حمض يوريك" },
    { name: "الغدة الدرقية (TSH)", price: 150, duration: "4 ساعات", description: "TSH, T3, T4" },
    { name: "فيتامين د", price: 180, duration: "6 ساعات", description: "قياس مستوى فيتامين د" },
    { name: "صورة دهون (Lipid Profile)", price: 120, duration: "3 ساعات", description: "الكوليسترول والدهون الثلاثية" },
    { name: "تحليل بول كامل", price: 50, duration: "ساعة", description: "فحص شامل للبول" },
  ],
};

export default function LabDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [lab, setLab] = useState<Lab>(SAMPLE);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");

  useEffect(() => {
    if (id && id !== "sample") getLabById(id).then((l) => { if (l) setLab(l); });
  }, [id]);

  const tests: LabTest[] = lab.tests?.length ? lab.tests : SAMPLE.tests!;
  const filtered = tests.filter((t) => t.name.includes(q));

  const toggle = (name: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  const total = useMemo(
    () => tests.filter((t) => selected.has(t.name)).reduce((s, t) => s + (t.price || 0), 0),
    [tests, selected],
  );

  const loc = [lab.address?.line1, lab.address?.city].filter(Boolean).join("، ") || "غير محدد";
  const hours = lab.workingHours?.from ? `${lab.workingHours.from} - ${lab.workingHours.to}` : "غير محدد";
  const img = lab.image?.startsWith("http") ? lab.image : FALLBACK_IMG;

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicHeader active="labs" />

      <main className="mx-auto max-w-container-max px-margin-mobile py-20 md:px-margin-desktop md:py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 py-6 text-label-md text-on-surface-variant">
          <Link href="/" className="hover:text-primary">الرئيسية</Link>
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          <Link href="/labs" className="hover:text-primary">المعامل</Link>
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          <span className="font-medium text-primary">{lab.name}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-10">
          {/* Info + tests */}
          <div className="space-y-gutter lg:col-span-6">
            {/* Profile card */}
            <div className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-card md:flex-row">
              <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl md:w-40">
                <img src={img} alt={lab.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-grow">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h1 className="text-headline-lg text-on-surface">{lab.name}</h1>
                  {lab.isVerified && (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-label-md text-green-700">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>موثّق
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-body-md text-on-surface-variant">
                  <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[20px] text-primary">location_on</span>{loc}</p>
                  <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[20px] text-primary">schedule</span>مواعيد العمل: {hours}</p>
                  {lab.phone && <p className="flex items-center gap-2" dir="ltr"><span className="material-symbols-outlined text-[20px] text-primary">call</span>{lab.phone}</p>}
                </div>
                {!!lab.certifications?.length && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {lab.certifications.map((c) => (
                      <span key={c} className="rounded-full bg-surface-container-low px-3 py-1 text-caption text-on-surface-variant">{c}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tests catalog */}
            <div className="rounded-xl bg-white p-6 shadow-card">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-headline-md text-on-surface">التحاليل المتاحة</h2>
                <div className="relative">
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن تحليل"
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2 pr-10 pl-3 text-label-md outline-none focus:border-primary focus:ring-2 focus:ring-primary-container/20 sm:w-56" />
                </div>
              </div>

              <div className="divide-y divide-outline-variant/40">
                {filtered.map((t) => {
                  const on = selected.has(t.name);
                  return (
                    <label key={t.name} className="flex cursor-pointer items-center gap-4 py-4">
                      <input type="checkbox" checked={on} onChange={() => toggle(t.name)} className="h-5 w-5 rounded border-outline text-primary-container focus:ring-primary-container" />
                      <div className="flex-1">
                        <p className="text-body-md font-medium text-on-surface">{t.name}</p>
                        <p className="text-caption text-on-surface-variant">
                          {t.description}{t.duration ? ` · النتيجة خلال ${t.duration}` : ""}
                        </p>
                      </div>
                      <span className="shrink-0 font-bold text-primary">{t.price} ج.م</span>
                    </label>
                  );
                })}
                {!filtered.length && <p className="py-8 text-center text-body-md text-on-surface-variant">لا توجد تحاليل مطابقة</p>}
              </div>
            </div>
          </div>

          {/* Order sidebar */}
          <aside className="sticky top-24 lg:col-span-4">
            <div className="rounded-xl border-t-4 border-primary bg-white p-6 shadow-card">
              <h2 className="mb-5 flex items-center gap-2 text-headline-md text-on-surface">
                <span className="material-symbols-outlined text-primary">receipt_long</span>
                طلب التحاليل
              </h2>

              {selected.size === 0 ? (
                <div className="py-8 text-center text-body-md text-on-surface-variant">
                  <span className="material-symbols-outlined mb-2 text-[40px] text-outline-variant">science</span>
                  <p>اختر التحاليل من القائمة لإضافتها</p>
                </div>
              ) : (
                <ul className="mb-5 space-y-3">
                  {tests.filter((t) => selected.has(t.name)).map((t) => (
                    <li key={t.name} className="flex items-center justify-between gap-2 text-body-md">
                      <span className="flex items-center gap-2 text-on-surface">
                        <button onClick={() => toggle(t.name)} className="text-error"><span className="material-symbols-outlined text-[18px]">remove_circle</span></button>
                        {t.name}
                      </span>
                      <span className="shrink-0 text-on-surface-variant">{t.price} ج.م</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="space-y-4 border-t border-outline-variant pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-body-md text-on-surface-variant">الإجمالي ({selected.size} تحليل)</span>
                  <span className="text-headline-md text-primary">{total} ج.م</span>
                </div>
                <Link href="/login" className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-headline-md text-white shadow-lg transition-all active:scale-95 ${selected.size ? "bg-primary-container hover:opacity-90" : "pointer-events-none bg-outline-variant"}`}>
                  تأكيد الحجز
                </Link>
                <p className="text-center text-caption text-on-surface-variant">* الدفع بعد إتمام سحب العينة</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <MobileBottomNav />
      <PublicFooter />
    </div>
  );
}
