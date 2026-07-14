"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { MobileBottomNav } from "@/components/public/MobileBottomNav";

type Tab = "about" | "hours" | "reviews";

export default function DoctorDetailPage() {
  const [tab, setTab] = useState<Tab>("about");
  const [slot, setSlot] = useState("01:00 م");

  const tabBtn = (key: Tab, label: string) => (
    <button
      onClick={() => setTab(key)}
      className={`px-6 py-5 text-label-md transition-all ${
        tab === key ? "border-b-2 border-primary text-primary" : "text-on-surface-variant hover:text-primary"
      }`}
    >
      {label}
    </button>
  );

  const stat = (icon: string, label: string, value: string) => (
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-primary">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-caption text-on-surface-variant">{label}</p>
        <p className="text-label-md text-on-surface">{value}</p>
      </div>
    </div>
  );

  const days = [
    { d: "اليوم", n: "24", m: "يوليو" },
    { d: "السبت", n: "25", m: "يوليو" },
    { d: "الأحد", n: "26", m: "يوليو" },
    { d: "الاثنين", n: "27", m: "يوليو" },
  ];
  const morning = ["09:00 ص", "09:30 ص", "10:00 ص"];
  const evening = ["01:00 م", "01:30 م", "02:00 م"];

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicHeader active="doctors" />

      <main className="mx-auto max-w-container-max px-margin-mobile py-20 md:px-margin-desktop md:py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 py-6 text-label-md text-on-surface-variant">
          <Link href="/" className="hover:text-primary">الرئيسية</Link>
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          <Link href="/doctors" className="hover:text-primary">الأطباء</Link>
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          <span className="font-medium text-primary">د. ليلى الماجد</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-10">
          {/* Info column */}
          <div className="space-y-gutter lg:col-span-6">
            {/* Profile card */}
            <div className="flex flex-col gap-8 rounded-xl bg-white p-8 shadow-card md:flex-row">
              <div className="relative flex-shrink-0">
                <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-xl bg-surface-container text-primary">
                  <span className="material-symbols-outlined text-[64px]">stethoscope</span>
                </div>
                <div className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-primary-container px-3 py-1 text-caption text-white shadow-lg">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span>موثّق</span>
                </div>
              </div>

              <div className="flex-grow space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-headline-lg text-on-surface">د. ليلى الماجد</h1>
                    <p className="mt-1 text-body-md text-primary">استشاري جراحة القلب والأوعية الدموية</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex text-amber-500">
                      {[0, 1, 2, 3].map((i) => (
                        <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                    </div>
                    <span className="text-caption text-on-surface-variant">(124 تقييم)</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-4 md:grid-cols-3">
                  {stat("work_history", "الخبرة", "15+ عاماً")}
                  {stat("person", "المرضى", "2,500+")}
                  {stat("language", "اللغات", "العربية، الإنجليزية")}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="overflow-hidden rounded-xl bg-white shadow-card">
              <div className="flex border-b border-outline-variant px-8">
                {tabBtn("about", "نبذة عن الطبيب")}
                {tabBtn("hours", "مواعيد العمل")}
                {tabBtn("reviews", "التقييمات")}
              </div>

              <div className="p-8">
                {tab === "about" && (
                  <div className="space-y-8">
                    <section>
                      <h3 className="mb-4 text-headline-md text-on-surface">السيرة المهنية</h3>
                      <p className="text-body-md leading-relaxed text-on-surface-variant">
                        تُعد الدكتورة ليلى الماجد من الرواد في مجال جراحة القلب والأوعية الدموية. حصلت على زمالة كلية الجراحين الملكية، وشاركت في أكثر من 1,000 عملية جراحية معقدة، وتركّز على تقنيات الجراحة طفيفة التوغل.
                      </p>
                    </section>
                    <section>
                      <h3 className="mb-4 text-headline-md text-on-surface">الشهادات والاعتمادات</h3>
                      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {[
                          ["school", "دكتوراه في جراحة القلب - جامعة لندن"],
                          ["verified", "البورد العربي للجراحة العامة"],
                          ["workspace_premium", "عضو الجمعية الأوروبية لجراحة القلب"],
                          ["clinical_notes", "ترخيص مزاولة استشاري - الفئة أ"],
                        ].map(([icon, text]) => (
                          <li key={text} className="flex items-center gap-3 rounded-lg bg-surface-container-low p-4">
                            <span className="material-symbols-outlined text-primary">{icon}</span>
                            <span className="text-body-md">{text}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                )}

                {tab === "hours" && (
                  <div className="divide-y divide-outline-variant">
                    {[["الأحد - الخميس", "08:00 ص - 04:00 م", false], ["الجمعة", "مغلق", true], ["السبت", "10:00 ص - 02:00 م", false]].map(([d, h, closed]) => (
                      <div key={d as string} className="flex items-center justify-between py-4">
                        <span className="text-body-md">{d}</span>
                        <span className={`font-medium ${closed ? "text-error" : "text-primary"}`}>{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                {tab === "reviews" && (
                  <div className="space-y-6">
                    <div className="rounded-xl border border-outline-variant p-6">
                      <div className="mb-2 flex justify-between">
                        <span className="text-label-md">أحمد المرزوقي</span>
                        <div className="flex origin-left scale-75 text-amber-500">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-body-md text-on-surface-variant">دكتورة رائعة ومتمكنة جداً، شرحت لي الحالة بالتفصيل. الطاقم الطبي أيضاً كان ممتازاً.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking widget */}
          <aside className="sticky top-24 lg:col-span-4">
            <div className="rounded-xl border-t-4 border-primary bg-white p-8 shadow-card">
              <h2 className="mb-6 flex items-center gap-2 text-headline-md text-on-surface">
                <span className="material-symbols-outlined text-primary">calendar_month</span>
                احجز موعدك الآن
              </h2>

              <div className="mb-8 space-y-4">
                <label className="block text-label-md text-on-surface-variant">اختر التاريخ</label>
                <div className="grid grid-cols-4 gap-2">
                  {days.map((day, i) => (
                    <button key={day.n} className={`flex flex-col items-center rounded-lg p-3 transition-colors ${i === 0 ? "border-2 border-primary bg-surface-container-low text-primary ring-2 ring-primary/10" : "border border-outline-variant hover:border-primary"}`}>
                      <span className="text-caption">{day.d}</span>
                      <span className="text-body-md font-bold">{day.n}</span>
                      <span className="text-caption">{day.m}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8 space-y-4">
                <label className="block text-label-md text-on-surface-variant">المواعيد المتاحة</label>
                <span className="text-caption text-primary">صباحاً</span>
                <div className="grid grid-cols-3 gap-2">
                  {morning.map((t, i) => (
                    <button key={t} disabled={i === 2} onClick={() => setSlot(t)}
                      className={`rounded-lg border py-2 text-center text-body-md transition-all ${i === 2 ? "cursor-not-allowed border-outline-variant bg-surface-container-highest text-on-surface-variant opacity-50" : slot === t ? "border-primary bg-primary-container text-white" : "border-outline-variant hover:bg-primary-container hover:text-white"}`}>
                      {t}
                    </button>
                  ))}
                </div>
                <span className="text-caption text-primary">مساءً</span>
                <div className="grid grid-cols-3 gap-2">
                  {evening.map((t) => (
                    <button key={t} onClick={() => setSlot(t)}
                      className={`rounded-lg border py-2 text-center text-body-md transition-all ${slot === t ? "border-primary bg-primary-container text-white" : "border-outline-variant hover:bg-primary-container hover:text-white"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6 border-t border-outline-variant pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-body-md text-on-surface-variant">رسوم الاستشارة</span>
                  <span className="text-headline-md text-primary">350 ج.م</span>
                </div>
                <Link href="/login" className="block w-full rounded-xl bg-primary-container py-4 text-center text-headline-md text-white shadow-lg transition-all hover:opacity-90 active:scale-95">
                  تأكيد الحجز
                </Link>
                <p className="text-center text-caption text-on-surface-variant">* لا يتم خصم المبلغ إلا بعد إتمام الزيارة</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <MobileBottomNav active="specialties" />
      <PublicFooter />
    </div>
  );
}
