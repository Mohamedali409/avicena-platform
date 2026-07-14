/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { MobileBottomNav } from "@/components/public/MobileBottomNav";
import { DoctorMap } from "@/components/public/DoctorMap";
import { getLabs, type Lab } from "@/features/labs/api";

// Themed lab/facility photos — used as the real image OR a fallback so every card has a photo.
const PHOTOS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA7q3qROcmFdCPRfZo5-nx8APO-Ogybqet_q2iA-88y65C5tGImEmhex6K6pmLJ_CWRPFonZmguAjCRafZ5M_tonQLPL_O3edbOoiwdIfOETWKVXDX_A5FLxD8Zp2Fs02-poPvN7p99SIgUclJOFRPA7iMETi2Ee9N8Urr42gBdNg-nEhbMMKunX2uTZbZ1Bwp9AWh9HEDIgeVeUNJZkIOxr3L7m56Tvb9FBBEJLtB3DygxUWX8bxhKUNVEcGhJ0VKKOMSQ9UAVq4M",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDqVOjbEskqd53DZHDcjmT3b6x5dDbK6TZEWkkyG6tDfcJ242JsZcue1uoXuus39kI4J2L2-fLV8QBLpfJ-xw8hoFVE2g9AEB-OE9TUbXNvaRTpzAZ6ydpCfjdYe1x3yJgYxfcsNfzKLTRuk5pY_YARyF4ZwGfbkYcC0ROujIS7zgR_kMEMcAKRUdaDyV0en76HH42SCPSmcQleBAISwC2KzyANbKLKGHrAtZLepYn_jqTvPvK9lfJ3GJGdfkPB9opX0KQ22vIuxks",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB4TpUL3jVd8WJbhHv5xw4tFKO0xhGobewpYa81Yvwi2G5RRzTCBMXyIHghdptV5-7xhzHyUxTE6KDgXr9pXlCLKXKb93fn_GoMBjhMVX1DmWmO82dCZnzxcOHsUEBqgW8FKcr8mQHyXDGdBiGBzHVkATLoVl-Jn6wQAJ3OKiy7dfwbb8VgBCT4Yuua9aUzmtOYP7TFdaFmxpd4_SA83-rEhx8PsR4i8CHiMqAkOcf2a2rGVhyMDKZAWzGC0-GUVhvvnnIS1GzU3-k",
];

const imgFor = (image: string | undefined, i: number) =>
  image?.startsWith("http") ? image : PHOTOS[i % PHOTOS.length];

const SAMPLE: Lab[] = [
  { _id: "l1", name: "مختبرات البرج", address: { line1: "القاهرة، مدينة نصر" }, workingHours: { from: "08:00", to: "22:00" }, isVerified: true, tests: Array(150).fill({ name: "", price: 0 }), image: PHOTOS[0] },
  { _id: "l2", name: "مركز ألفا للأشعة", address: { line1: "الجيزة، المهندسين" }, workingHours: { from: "09:00", to: "21:00" }, isVerified: true, tests: Array(120).fill({ name: "", price: 0 }), image: PHOTOS[1] },
  { _id: "l3", name: "مختبرات طيبة", address: { line1: "الإسكندرية، سموحة" }, workingHours: { from: "00:00", to: "24:00" }, isVerified: true, tests: Array(200).fill({ name: "", price: 0 }) },
  { _id: "l4", name: "المختبر الحديث", address: { line1: "القاهرة، المعادي" }, workingHours: { from: "09:00", to: "23:00" }, isVerified: false, tests: Array(180).fill({ name: "", price: 0 }) },
  { _id: "l5", name: "مختبر العناية", address: { line1: "الجيزة، الدقي" }, workingHours: { from: "08:00", to: "20:00" }, isVerified: true, tests: Array(90).fill({ name: "", price: 0 }) },
];

function FilterPanel() {
  const checkbox = "h-5 w-5 rounded border-outline text-primary-container focus:ring-primary-container";
  const optionText = "text-body-md text-on-surface-variant transition-colors group-hover:text-primary";
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-headline-md text-on-surface">الفلاتر</h2>
        <button className="text-label-md text-primary hover:underline">مسح الكل</button>
      </div>

      <div className="mb-8"><DoctorMap /></div>

      {/* Test type */}
      <div className="mb-8 border-t border-outline-variant/30 pt-6">
        <p className="mb-4 font-bold text-on-surface">نوع التحاليل</p>
        <div className="space-y-3">
          {["تحاليل الدم", "الأشعة والتصوير", "الهرمونات", "الفيتامينات", "PCR / كورونا"].map((s, i) => (
            <label key={s} className="group flex cursor-pointer items-center gap-3">
              <input type="checkbox" defaultChecked={i === 0} className={checkbox} />
              <span className={optionText}>{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Open now */}
      <div className="mb-6 border-t border-outline-variant/30 pt-6">
        <div className="flex items-center justify-between">
          <span className="font-bold text-on-surface">مفتوح الآن</span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" defaultChecked />
            <div className="peer h-6 w-11 rounded-full bg-outline-variant after:absolute after:right-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-container rtl:peer-checked:after:-translate-x-full" />
          </label>
        </div>
      </div>

      {/* Verified only */}
      <div className="mb-8 border-t border-outline-variant/30 pt-6">
        <div className="flex items-center justify-between">
          <span className="font-bold text-on-surface">المعامل الموثّقة فقط</span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" />
            <div className="peer h-6 w-11 rounded-full bg-outline-variant after:absolute after:right-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-container rtl:peer-checked:after:-translate-x-full" />
          </label>
        </div>
      </div>

      {/* Price */}
      <div className="border-t border-outline-variant/30 pt-6">
        <p className="mb-4 font-bold text-on-surface">سعر التحليل (ج.م)</p>
        <input type="range" min={20} max={500} step={10} defaultValue={150} className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-high" style={{ accentColor: "#0e7490" }} />
        <div className="mt-2 flex justify-between text-caption text-on-surface-variant">
          <span>20</span><span className="font-bold text-primary">150</span><span>500</span>
        </div>
      </div>
    </div>
  );
}

function LabCard({ lab, img }: { lab: Lab; img: string }) {
  const loc = [lab.address?.line1, lab.address?.city].filter(Boolean).join("، ") || "غير محدد";
  const hours = lab.workingHours?.from ? `${lab.workingHours.from} - ${lab.workingHours.to}` : "غير محدد";
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Image on top */}
      <div className="relative h-44 w-full overflow-hidden">
        <img alt={lab.name} src={img} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {lab.isVerified && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-label-md text-green-700 shadow-sm">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            موثّق
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-headline-md text-on-surface transition-colors group-hover:text-primary">{lab.name}</h3>
        <div className="mb-2 flex items-center gap-2 text-body-md text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">location_on</span>
          <span className="line-clamp-1">{loc}</span>
        </div>
        <div className="mb-4 flex items-center gap-2 text-body-md text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">schedule</span>
          <span>{hours}</span>
        </div>

        <div className="mt-auto flex flex-col gap-4 border-t border-outline-variant/30 pt-4">
          <span className="text-label-md font-bold text-primary">عدد التحاليل المتاحة: {lab.tests?.length ?? 0}+</span>
          <Link href={`/labs/${lab._id}`} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-3 text-label-md text-white shadow-sm transition-all hover:bg-primary active:scale-[0.98]">
            عرض التحاليل
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>(SAMPLE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { getLabs().then((list) => { if (list.length) setLabs(list); }); }, []);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicHeader active="labs" />

      <main className="mx-auto max-w-container-max px-margin-mobile py-20 md:px-margin-desktop md:py-10">
        {/* Title + mobile actions */}
        <div className="mb-6 flex flex-col gap-4">
          <div>
            <h1 className="mb-1 text-headline-lg text-on-surface">المختبرات والتحاليل الطبية</h1>
            <p className="text-body-md text-on-surface-variant">احجز تحاليلك من أفضل المختبرات المعتمدة.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDrawerOpen(true)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-container px-4 py-2.5 text-label-md text-white shadow-md active:scale-95 lg:hidden">
              <span className="material-symbols-outlined text-[20px]">tune</span>
              الفلاتر والخريطة
            </button>
            <select className="flex-1 rounded-lg border-outline-variant bg-white px-4 py-2.5 text-label-md focus:border-primary focus:ring-primary lg:flex-none">
              <option>الأكثر صلة</option>
              <option>الأعلى تقييماً</option>
              <option>الأقرب</option>
            </select>
          </div>
        </div>

        {/* flex-row → filter sidebar on the RIGHT in RTL, cards fill the left */}
        <div className="flex flex-col gap-gutter lg:flex-row">
          <aside className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto rounded-xl bg-white p-6 shadow-card">
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {labs.map((lab, i) => <LabCard key={lab._id} lab={lab} img={imgFor(lab.image, i)} />)}
            </div>

            {/* CTA */}
            <section className="relative mt-12 flex flex-col items-center justify-between gap-6 overflow-hidden rounded-xl bg-primary-container p-8 text-white md:flex-row">
              <div className="text-center md:text-right">
                <h2 className="mb-2 text-headline-md text-white">هل تمتلك مختبراً طبياً؟</h2>
                <p className="max-w-xl text-body-md text-on-primary-container opacity-90">انضم لمنصة ابن سينا ووسّع وصولك لآلاف المرضى.</p>
              </div>
              <Link href="/login" className="flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-primary transition-colors hover:bg-surface-variant">
                سجّل مختبرك <span className="material-symbols-outlined">add_business</span>
              </Link>
            </section>
          </div>
        </div>
      </main>

      {/* Mobile filter drawer */}
      <div onClick={() => setDrawerOpen(false)} className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside className={`fixed right-0 top-0 z-[101] flex h-full w-[88%] max-w-sm flex-col overflow-y-auto bg-background shadow-2xl transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-outline-variant bg-white p-4">
          <h2 className="text-headline-md text-primary">الفلاتر والخريطة</h2>
          <button onClick={() => setDrawerOpen(false)} className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low"><span className="material-symbols-outlined">close</span></button>
        </div>
        <div className="flex-grow p-margin-mobile"><FilterPanel /></div>
        <div className="sticky bottom-0 border-t border-outline-variant bg-white p-4">
          <button onClick={() => setDrawerOpen(false)} className="w-full rounded-xl bg-primary-container py-3.5 font-bold text-white shadow-lg">عرض النتائج</button>
        </div>
      </aside>

      <MobileBottomNav />
      <PublicFooter />
    </div>
  );
}
