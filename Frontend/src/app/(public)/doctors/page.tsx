/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { MobileBottomNav } from "@/components/public/MobileBottomNav";
import { getDoctors, type Doctor } from "@/features/doctors/api";
import { DoctorMap } from "@/components/public/DoctorMap";

// Stitch design placeholder photos — swap for real doctor.image from the API later.
const PHOTOS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBqGYWAePhH8ANA80i3hrK5tFQEE6fKk-wCX0pFZgYHm7lIq9AO4j_9QMqXiVeNyzHkvsDYSe_t7WvI7bf-kf5Am9wv-YCv9xzEXjP4t14tlTpimc7lNaASWTCGUOVyRU0cQvpV4_beyOLqEJRsBerNqUU_CTZU7DArVK9glV94zAvaZltnt0vp6pPUt0C1EgDsyXJLpbcxiR5TEkvUxRotsFMGRqULpJ2KacEtoEZNhqErxED18EjakyLMLRiX_Yz8Ui7uHkgFK_A",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuApRL0uEQ3okrw2cO-rFW7kCtegCeP5VlW-p6jzQavnBw1dF5iOcfD0AJo1hFxhGNYKPySBc0pBkL4zFqf0WLXD4sN_koPJmw9L45m-otS0dCmoqVBNW5qW_8SzV-2vqFB2EkkGmorCbaJju4p8MAj8dUBd-fNo10SGftoAOLyLQcvUVEkOHnuk3YbfxRUH_E1Dkw23PB9dlFhkof_ELb2Z906Nk3Bk3L55-KxAo4xa_Moi5tALzMeFsBCDSelmwJQuht5Mj7PQhqI",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAYDDkUtGJlOmyHny6e6SVqEpfS3VYDowBZ0DnDIwRpHJWwlHTt0q4MJe8Qnf9CMZ1MlG5kHEDWSyGqwyzAq2Dj2aDrc2pfgLrc7hhATQ4cIuOA3UkggR3Rlqd4srr1dZiBjSHxoEjTip9zbraWK6TTZIZbpLOk6bw8FagXeKnI3Fwn0AaPT3VI_JqYESEgYHqR4L9Sz4B57F_xFFn2Bl9ICZU7NgF7HOTG6tGzV_UKKcI4ORjv-8QNcXDxuH_u15Su9WCnDbOtoKc",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC-pOb0lBdcsn_Bau-fj5g751-t8Qo12tPll_H5Fht7esqMg2xNYF82iv_n-G6MjriKZ39UKy_y2SFz4585Sn5-vQiW_b1RRYd8B8tdBuC2WjjdcM_j2MRL2FU3q5lFLdX5JeXUopTEWQ85AMHV7scBWploEHa4OofyZ3QnEPprP4x7MxiJPC3vaE66K2PTyKfTqIZo3cbPUF-QiYciLI7FCDQvE_drEjIMf2HHeykv1DA5zZSyUtnRO7Y8AlmdCGKm8sEVuyH8DNc",
];

const imgFor = (image: string | undefined, i: number) =>
  image?.startsWith("http") ? image : PHOTOS[i % PHOTOS.length];

const SAMPLE: Doctor[] = [
  { _id: "s1", doctorName: "د. ليلى الماجد", Specialization: "أخصائية أمراض القلب", degree: "دكتوراه في جراحة القلب والأوعية الدموية", expertise: "15", fees: 250, available: true, image: PHOTOS[0] },
  { _id: "s2", doctorName: "د. سمير المنصور", Specialization: "استشاري جراحة القلب", degree: "زمالة كلية الجراحين الملكية", expertise: "12", fees: 300, available: true, image: PHOTOS[1] },
  { _id: "s3", doctorName: "د. نورا العلي", Specialization: "أخصائية الأمراض الجلدية", degree: "ماجستير الأمراض الجلدية والتجميل", expertise: "10", fees: 200, available: true, image: PHOTOS[2] },
  { _id: "s4", doctorName: "د. باسم حكيم", Specialization: "استشاري الطب النفسي", degree: "دكتوراه الطب النفسي", expertise: "20", fees: 350, available: false, image: PHOTOS[3] },
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

      {/* Specialization */}
      <div className="mb-8 border-t border-outline-variant/30 pt-6">
        <p className="mb-4 font-bold text-on-surface">التخصص</p>
        <div className="space-y-3">
          {["القلب والأوعية الدموية", "العظام والمفاصل", "طب الأطفال", "الجلدية"].map((s, i) => (
            <label key={s} className="group flex cursor-pointer items-center gap-3">
              <input type="checkbox" defaultChecked={i === 0} className={checkbox} />
              <span className={optionText}>{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-8 border-t border-outline-variant/30 pt-6">
        <div className="flex items-center justify-between">
          <span className="font-bold text-on-surface">متاح الآن</span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" defaultChecked />
            <div className="peer h-6 w-11 rounded-full bg-outline-variant after:absolute after:right-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-container rtl:peer-checked:after:-translate-x-full" />
          </label>
        </div>
      </div>

      {/* Price */}
      <div className="mb-8 border-t border-outline-variant/30 pt-6">
        <p className="mb-4 font-bold text-on-surface">سعر الكشف (ج.م)</p>
        <input type="range" min={50} max={500} step={10} defaultValue={250} className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-high" style={{ accentColor: "#0e7490" }} />
        <div className="mt-2 flex justify-between text-caption text-on-surface-variant">
          <span>50</span><span className="font-bold text-primary">250</span><span>500</span>
        </div>
      </div>

      {/* Gender */}
      <div className="border-t border-outline-variant/30 pt-6">
        <p className="mb-4 font-bold text-on-surface">الجنس</p>
        <div className="space-y-3">
          {["الكل", "ذكر", "أنثى"].map((g, i) => (
            <label key={g} className="group flex cursor-pointer items-center gap-3">
              <input type="radio" name="gender" defaultChecked={i === 0} className="h-5 w-5 border-outline text-primary-container focus:ring-primary-container" />
              <span className={optionText}>{g}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function DoctorCard({ d, img }: { d: Doctor; img: string }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Image on top */}
      <div className="relative h-52 w-full overflow-hidden bg-surface-container-low">
        <img alt={d.doctorName} src={img} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {/* rating chip */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 shadow-sm backdrop-blur-sm">
          <span className="material-symbols-outlined text-sm text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="text-label-md font-bold">4.8</span>
        </div>
        {/* availability */}
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-caption font-medium ${d.available === false ? "bg-surface-container-highest text-on-surface-variant" : "bg-green-100 text-green-700"}`}>
          {d.available === false ? "غير متاح" : "متاح الآن"}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1 text-headline-md text-on-surface transition-colors group-hover:text-primary">{d.doctorName}</h3>
        <p className="mb-2 text-body-md font-medium text-primary">{d.Specialization}</p>
        {d.degree && <p className="mb-4 line-clamp-2 text-caption text-on-surface-variant">{d.degree}</p>}

        <div className="mt-auto flex flex-col gap-4">
          <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4 text-body-md text-on-surface-variant">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">work_history</span>
              <span className="text-caption">{d.expertise ? `${d.expertise}+ سنوات خبرة` : "خبرة واسعة"}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-primary">
              <span className="material-symbols-outlined text-[18px]">payments</span>
              <span>{d.fees} ج.م</span>
            </div>
          </div>
          <Link href={`/doctors/${d._id}`} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-3 text-label-md text-white shadow-sm transition-all hover:bg-primary active:scale-[0.98]">
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            احجز موعد
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(SAMPLE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    getDoctors().then((list) => { if (list.length) setDoctors(list); });
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicHeader active="doctors" />

      <main className="mx-auto max-w-container-max px-margin-mobile py-20 md:px-margin-desktop md:py-10">
        {/* Title + mobile actions (best mobile order: title → filter/sort → cards) */}
        <div className="mb-6 flex flex-col gap-4">
          <div>
            <h1 className="mb-1 text-headline-lg text-on-surface">نخبة الأطباء المتخصصين</h1>
            <p className="text-body-md text-on-surface-variant">اكتشف أفضل رعاية صحية مع أطباء معتمدين.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDrawerOpen(true)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-container px-4 py-2.5 text-label-md text-white shadow-md active:scale-95 lg:hidden">
              <span className="material-symbols-outlined text-[20px]">tune</span>
              الفلاتر والخريطة
            </button>
            <select className="flex-1 rounded-lg border-outline-variant bg-white px-4 py-2.5 text-label-md focus:border-primary focus:ring-primary lg:flex-none">
              <option>الأكثر صلة</option>
              <option>الأعلى تقييماً</option>
              <option>السعر: الأقل للأعلى</option>
            </select>
          </div>
        </div>

        {/* flex-row (not reversed) → in RTL the sidebar sits on the RIGHT, cards fill the rest on the left */}
        <div className="flex flex-col gap-gutter lg:flex-row">
          {/* Desktop filter sidebar (right in RTL) */}
          <aside className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto rounded-xl bg-white p-6 shadow-card">
              <FilterPanel />
            </div>
          </aside>

          {/* Listing */}
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {doctors.map((d, i) => <DoctorCard key={d._id} d={d} img={imgFor(d.image, i)} />)}
            </div>

            <div className="mt-10 flex items-center justify-center gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors hover:bg-primary-container hover:text-white"><span className="material-symbols-outlined">chevron_right</span></button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container font-medium text-white">1</button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors hover:bg-primary-container hover:text-white">2</button>
              <span className="px-2 text-outline">...</span>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors hover:bg-primary-container hover:text-white"><span className="material-symbols-outlined">chevron_left</span></button>
            </div>
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

      <MobileBottomNav active="specialties" />
      <PublicFooter />
    </div>
  );
}
