/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

// NOTE: image URLs below are the Stitch design placeholders (Google-hosted).
// Swap them for real assets / API data (doctor.image, lab.image) later.
const IMG = {
  heroDoc: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-pOb0lBdcsn_Bau-fj5g751-t8Qo12tPll_H5Fht7esqMg2xNYF82iv_n-G6MjriKZ39UKy_y2SFz4585Sn5-vQiW_b1RRYd8B8tdBuC2WjjdcM_j2MRL2FU3q5lFLdX5JeXUopTEWQ85AMHV7scBWploEHa4OofyZ3QnEPprP4x7MxiJPC3vaE66K2PTyKfTqIZo3cbPUF-QiYciLI7FCDQvE_drEjIMf2HHeykv1DA5zZSyUtnRO7Y8AlmdCGKm8sEVuyH8DNc",
  docSamir: "https://lh3.googleusercontent.com/aida-public/AB6AXuApRL0uEQ3okrw2cO-rFW7kCtegCeP5VlW-p6jzQavnBw1dF5iOcfD0AJo1hFxhGNYKPySBc0pBkL4zFqf0WLXD4sN_koPJmw9L45m-otS0dCmoqVBNW5qW_8SzV-2vqFB2EkkGmorCbaJju4p8MAj8dUBd-fNo10SGftoAOLyLQcvUVEkOHnuk3YbfxRUH_E1Dkw23PB9dlFhkof_ELb2Z906Nk3Bk3L55-KxAo4xa_Moi5tALzMeFsBCDSelmwJQuht5Mj7PQhqI",
  docLayla: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqGYWAePhH8ANA80i3hrK5tFQEE6fKk-wCX0pFZgYHm7lIq9AO4j_9QMqXiVeNyzHkvsDYSe_t7WvI7bf-kf5Am9wv-YCv9xzEXjP4t14tlTpimc7lNaASWTCGUOVyRU0cQvpV4_beyOLqEJRsBerNqUU_CTZU7DArVK9glV94zAvaZltnt0vp6pPUt0C1EgDsyXJLpbcxiR5TEkvUxRotsFMGRqULpJ2KacEtoEZNhqErxED18EjakyLMLRiX_Yz8Ui7uHkgFK_A",
  docPreview: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYDDkUtGJlOmyHny6e6SVqEpfS3VYDowBZ0DnDIwRpHJWwlHTt0q4MJe8Qnf9CMZ1MlG5kHEDWSyGqwyzAq2Dj2aDrc2pfgLrc7hhATQ4cIuOA3UkggR3Rlqd4srr1dZiBjSHxoEjTip9zbraWK6TTZIZbpLOk6bw8FagXeKnI3Fwn0AaPT3VI_JqYESEgYHqR4L9Sz4B57F_xFFn2Bl9ICZU7NgF7HOTG6tGzV_UKKcI4ORjv-8QNcXDxuH_u15Su9WCnDbOtoKc",
  labBurj: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7q3qROcmFdCPRfZo5-nx8APO-Ogybqet_q2iA-88y65C5tGImEmhex6K6pmLJ_CWRPFonZmguAjCRafZ5M_tonQLPL_O3edbOoiwdIfOETWKVXDX_A5FLxD8Zp2Fs02-poPvN7p99SIgUclJOFRPA7iMETi2Ee9N8Urr42gBdNg-nEhbMMKunX2uTZbZ1Bwp9AWh9HEDIgeVeUNJZkIOxr3L7m56Tvb9FBBEJLtB3DygxUWX8bxhKUNVEcGhJ0VKKOMSQ9UAVq4M",
  labAlpha: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqVOjbEskqd53DZHDcjmT3b6x5dDbK6TZEWkkyG6tDfcJ242JsZcue1uoXuus39kI4J2L2-fLV8QBLpfJ-xw8hoFVE2g9AEB-OE9TUbXNvaRTpzAZ6ydpCfjdYe1x3yJgYxfcsNfzKLTRuk5pY_YARyF4ZwGfbkYcC0ROujIS7zgR_kMEMcAKRUdaDyV0en76HH42SCPSmcQleBAISwC2KzyANbKLKGHrAtZLepYn_jqTvPvK9lfJ3GJGdfkPB9opX0KQ22vIuxks",
};

const SPEC_DESKTOP = [
  { icon: "cardiology", label: "أمراض القلب" },
  { icon: "child_care", label: "طب الأطفال" },
  { icon: "dermatology", label: "الجلدية" },
  { icon: "stethoscope", label: "الباطنة" },
  { icon: "psychology", label: "الطب النفسي" },
  { icon: "visibility", label: "طب العيون" },
];
const SPEC_MOBILE = [
  { icon: "cardiology", label: "القلب" },
  { icon: "neurology", label: "الأعصاب" },
  { icon: "pediatrics", label: "الأطفال" },
  { icon: "dentistry", label: "الأسنان" },
  { icon: "ophthalmology", label: "العيون" },
];
const FEATURES = [
  { icon: "bolt", title: "حجز فوري", body: "لا مزيد من الانتظار. احصل على موعدك خلال ثوانٍ معدودة.", accent: false },
  { icon: "videocam", title: "استشارة بالفيديو", body: "تواصل مباشر مع طبيبك عبر اتصال مشفّر وآمن يضمن خصوصيتك.", accent: true },
  { icon: "folder_shared", title: "ملف طبي ذكي", body: "جميع تقاريرك وفحوصاتك ووصفاتك في مكان واحد آمن.", accent: false },
];
const DOCS_DESKTOP = [
  { name: "د. ليلى الماجد", spec: "أخصائية القلب والأوعية", exp: "15", rating: "4.9", img: IMG.docPreview },
  { name: "د. عمر خالد", spec: "استشاري طب الأطفال", exp: "8", rating: "4.8", img: IMG.docSamir },
  { name: "د. نورا العلي", spec: "أخصائية الأمراض الجلدية", exp: "12", rating: "5.0", img: IMG.docLayla },
  { name: "د. باسم حكيم", spec: "استشاري الطب النفسي", exp: "20", rating: "4.7", img: IMG.heroDoc },
];
const DOCS_MOBILE = [
  { name: "د. سمير المنصور", spec: "استشاري جراحة القلب", rating: "4.9", fee: "150", img: IMG.docSamir },
  { name: "د. ليلى حسن", spec: "أخصائية طب الأطفال", rating: "4.8", fee: "120", img: IMG.docLayla },
  { name: "د. نورا العلي", spec: "أخصائية الجلدية", rating: "5.0", fee: "180", img: IMG.docPreview },
];
const LABS_MOBILE = [
  { name: "مختبرات البرج", desc: "فحص شامل للدم", badge: "خصم 20%", img: IMG.labBurj },
  { name: "مركز ألفا للأشعة", desc: "أشعة مقطعية ومغناطيسية", img: IMG.labAlpha },
];
const LABS_DESKTOP = [
  { name: "مختبرات البرج", loc: "القاهرة، مدينة نصر", rating: "4.9", icon: "biotech" },
  { name: "مختبرات ألفا", loc: "الجيزة، المهندسين", rating: "4.8", icon: "science" },
  { name: "المختبر الحديث", loc: "الإسكندرية، سموحة", rating: "5.0", icon: "experiment" },
  { name: "مختبر العناية", loc: "القاهرة، المعادي", rating: "4.7", icon: "medication" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface">
      {/* Shared header (responsive) — same on every page */}
      <PublicHeader active="home" />

      {/* ============ DESKTOP ============ */}
      <div className="hidden md:block">
        {/* Hero */}
        <section className="bg-surface-container-low">
          <div className="mx-auto grid max-w-container-max grid-cols-2 items-center gap-12 px-margin-desktop py-16">
            <div className="text-right">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="text-label-md">موثوق من قبل +10,000 مريض</span>
              </div>
              <h2 className="mb-6 text-display font-bold leading-tight">استشارتك الطبية <span className="text-primary-container">عن بُعد</span> بكل خصوصية وأمان</h2>
              <p className="mb-10 max-w-xl text-body-lg leading-relaxed text-on-surface-variant">احصل على رعاية صحية متميزة من منزلك. ابن سينا يربطك بأفضل الأطباء والمتخصصين.</p>
              <div className="flex max-w-2xl flex-row-reverse items-center gap-3 rounded-xl bg-white p-3 shadow-xl">
                <div className="relative w-full">
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                  <input type="text" placeholder="ابحث عن تخصص، طبيب أو حالة طبية..." className="w-full rounded-lg border-none bg-surface py-4 pr-12 pl-4 text-body-md focus:ring-2 focus:ring-primary/20" />
                </div>
                <Link href="/doctors" className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-container px-8 py-4 font-bold text-white transition-all hover:shadow-lg active:scale-95">
                  <span>احجز الآن</span><span className="material-symbols-outlined">calendar_month</span>
                </Link>
              </div>
              <div className="mt-8 flex flex-row-reverse items-center gap-6 text-on-surface-variant">
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary-container">timer</span><span className="text-body-md">رد خلال 15 دقيقة</span></div>
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary-container">video_chat</span><span className="text-body-md">جودة HD فائقة</span></div>
              </div>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-xl shadow-2xl">
              <img src={IMG.heroDoc} alt="طبيب" className="h-full w-full object-cover" />
              <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur">
                <div className="flex flex-row-reverse items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-white"><span className="material-symbols-outlined">emergency</span></div>
                  <div className="text-right"><p className="text-label-md font-bold text-primary">استشارة طارئة</p><p className="text-caption text-on-surface-variant">متاح الآن - د. أحمد سليم</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specialties */}
        <section className="mx-auto max-w-container-max px-margin-desktop py-section-gap">
          <div className="mb-10 text-right"><h3 className="mb-2 text-headline-lg">التخصصات الطبية</h3><p className="text-body-md text-on-surface-variant">تصفّح حسب التخصص للعثور على الطبيب المناسب</p></div>
          <div className="grid grid-cols-6 gap-gutter">
            {SPEC_DESKTOP.map((s) => (
              <Link key={s.label} href="/doctors" className="group rounded-xl border border-outline-variant/30 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-primary-container transition-all group-hover:scale-110 group-hover:bg-primary-container group-hover:text-white"><span className="material-symbols-outlined text-3xl">{s.icon}</span></div>
                <h4 className="text-label-md font-bold">{s.label}</h4>
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto my-16 max-w-container-max rounded-3xl border border-outline-variant/20 bg-white px-margin-desktop py-section-gap shadow-sm">
          <div className="mb-16 text-center"><h3 className="mb-4 text-headline-lg">لماذا تختار منصة ابن سينا؟</h3><p className="mx-auto max-w-2xl text-body-md text-on-surface-variant">نجمع بين التكنولوجيا المتطورة والخبرة الطبية لتقديم تجربة علاجية لا تُضاهى.</p></div>
          <div className="grid grid-cols-3 gap-gutter">
            {FEATURES.map((f) => (
              <div key={f.title} className={`group flex flex-col items-center rounded-xl p-8 text-center transition-all duration-300 hover:-translate-y-2 ${f.accent ? "bg-primary-container text-white shadow-lg" : "border border-outline-variant/30 bg-background"}`}>
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${f.accent ? "bg-white/20" : "bg-primary/5 text-primary-container"}`}><span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{f.icon}</span></div>
                <h4 className={`mb-4 text-headline-md ${f.accent ? "" : "text-primary"}`}>{f.title}</h4>
                <p className={`text-body-md ${f.accent ? "opacity-90" : "text-on-surface-variant"}`}>{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Doctors preview */}
        <section className="bg-surface-container-low py-section-gap">
          <div className="mx-auto max-w-container-max px-margin-desktop">
            <div className="mb-12 flex flex-row-reverse items-end justify-between">
              <div className="text-right"><h3 className="mb-2 text-headline-lg">نخبة الأطباء المتخصصين</h3><p className="text-body-md text-on-surface-variant">أفضل رعاية من قبل خبراء معتمدين</p></div>
              <Link href="/doctors" className="rounded-lg border border-primary px-5 py-2 text-label-md text-primary transition-all hover:bg-primary hover:text-white">عرض الكل</Link>
            </div>
            <div className="grid grid-cols-4 gap-gutter">
              {DOCS_DESKTOP.map((d) => (
                <div key={d.name} className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-52 overflow-hidden">
                    <img src={d.img} alt={d.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 shadow-sm"><span className="material-symbols-outlined text-sm text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="text-label-md font-bold">{d.rating}</span></div>
                  </div>
                  <div className="p-6 text-right">
                    <h5 className="mb-1 text-headline-md text-on-surface transition-colors group-hover:text-primary">{d.name}</h5>
                    <p className="mb-4 text-label-md text-primary-container">{d.spec}</p>
                    <div className="flex flex-row-reverse items-center justify-between"><span className="text-caption text-on-surface-variant">الخبرة: +{d.exp} عاماً</span><Link href="/doctors" className="rounded-lg bg-primary/5 p-2 text-primary-container transition-all hover:bg-primary-container hover:text-white"><span className="material-symbols-outlined">calendar_add_on</span></Link></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Labs */}
        <section className="mx-auto max-w-container-max px-margin-desktop py-section-gap">
          <div className="mb-12 text-right"><h3 className="mb-2 text-headline-lg">المختبرات المتميزة</h3><p className="text-body-md text-on-surface-variant">احجز تحاليلك الطبية من أفضل المختبرات المعتمدة</p></div>
          <div className="grid grid-cols-4 gap-gutter">
            {LABS_DESKTOP.map((l) => (
              <div key={l.name} className="group overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative flex h-48 items-center justify-center bg-surface-variant transition-colors group-hover:bg-primary/5"><span className="material-symbols-outlined text-6xl text-primary opacity-30">{l.icon}</span><div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 shadow-sm"><span className="material-symbols-outlined text-sm text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="text-label-md font-bold">{l.rating}</span></div></div>
                <div className="p-6 text-right">
                  <h5 className="mb-1 text-headline-md text-on-surface transition-colors group-hover:text-primary">{l.name}</h5>
                  <p className="mb-4 flex items-center justify-end gap-1 text-label-md text-on-surface-variant"><span className="material-symbols-outlined text-sm">location_on</span>{l.loc}</p>
                  <Link href="/labs" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-3 text-label-md text-white transition-all hover:brightness-110 active:scale-95"><span>احجز فحصاً</span><span className="material-symbols-outlined text-sm">arrow_back</span></Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA banner */}
        <section className="px-margin-desktop py-section-gap">
          <div className="relative mx-auto max-w-container-max overflow-hidden rounded-xl bg-primary-container p-12 text-white">
            <div className="absolute -mr-32 -mt-32 right-0 top-0 h-64 w-64 rounded-full bg-white/10" />
            <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row-reverse">
              <div className="max-w-xl text-right"><h3 className="mb-4 text-headline-lg">هل أنت طبيب متميز؟</h3><p className="text-body-lg opacity-90">انضم إلى شبكة ابن سينا وساهم في تحويل مستقبل الرعاية الصحية. ابدأ عيادتك الرقمية اليوم.</p></div>
              <Link href="/login" className="whitespace-nowrap rounded-lg bg-white px-10 py-4 font-bold text-primary shadow-xl transition-all hover:scale-105 active:scale-95">سجّل كطبيب الآن</Link>
            </div>
          </div>
        </section>
      </div>

      {/* ============ MOBILE ============ */}
      <div className="md:hidden">
        <main className="mt-16 space-y-8 px-margin-mobile pb-28">
          {/* Hero */}
          <section className="pt-6">
            <div className="space-y-4">
              <h1 className="text-headline-lg-mobile text-on-background">استشارتك الطبية عن بُعد</h1>
              <p className="max-w-[80%] text-body-md text-on-surface-variant">احصل على تشخيص دقيق من أفضل الأطباء وأنت في منزلك.</p>
              <div className="relative mt-6">
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input type="text" placeholder="ابحث عن طبيب، تخصص، أو مستشفى..." className="h-14 w-full rounded-xl border-none bg-white pr-12 pl-4 text-body-md shadow-card focus:ring-2 focus:ring-primary-container" />
                <Link href="/doctors" className="absolute inset-y-2 left-2 flex items-center rounded-lg bg-primary px-4 text-label-md text-white">بحث</Link>
              </div>
            </div>
          </section>

          {/* Specialties scroll */}
          <section className="-mx-margin-mobile space-y-4 overflow-hidden px-margin-mobile">
            <div className="flex items-center justify-between px-2"><h2 className="text-headline-md text-on-background">التخصصات الطبية</h2><Link href="/doctors" className="text-label-md text-primary">الكل</Link></div>
            <div className="flex gap-4 overflow-x-auto px-2 pb-2" style={{ scrollbarWidth: "none" }}>
              {SPEC_MOBILE.map((s) => (
                <Link key={s.label} href="/doctors" className="group flex flex-shrink-0 flex-col items-center gap-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container shadow-sm transition-transform group-active:scale-90"><span className="material-symbols-outlined text-3xl text-primary">{s.icon}</span></div>
                  <span className="text-label-md text-on-surface-variant">{s.label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Key features */}
          <section className="grid grid-cols-1 gap-4">
            <Link href="/doctors" className="relative flex items-center justify-between overflow-hidden rounded-xl bg-primary-container p-5 text-white transition-transform active:scale-[0.98]">
              <div className="z-10 space-y-2">
                <h3 className="text-headline-md">حجز فوري</h3>
                <p className="text-body-md opacity-90">تحدث مع طبيب عام في أقل من 5 دقائق</p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-label-md">ابدأ الآن <span className="material-symbols-outlined text-sm">arrow_back</span></div>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -left-4 rotate-12 text-8xl opacity-10">bolt</span>
            </Link>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3 rounded-xl border border-outline-variant/30 bg-surface-container-highest p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><span className="material-symbols-outlined text-primary">videocam</span></div>
                <div><h4 className="text-label-md font-bold text-on-background">استشارة مرئية</h4><p className="text-caption text-on-surface-variant">عالية الدقة وآمنة</p></div>
              </div>
              <div className="space-y-3 rounded-xl border border-outline-variant/30 bg-surface-container-highest p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><span className="material-symbols-outlined text-primary">description</span></div>
                <div><h4 className="text-label-md font-bold text-on-background">ملف طبي ذكي</h4><p className="text-caption text-on-surface-variant">سجلاتك في مكان واحد</p></div>
              </div>
            </div>
          </section>

          {/* Featured doctors slider */}
          <section className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-headline-md text-on-background">أطباء متميزون</h2><Link href="/doctors" className="text-label-md text-primary">عرض الكل</Link></div>
            <div className="-mx-margin-mobile flex gap-4 overflow-x-auto px-margin-mobile pb-4" style={{ scrollbarWidth: "none" }}>
              {DOCS_MOBILE.map((d) => (
                <div key={d.name} className="w-64 flex-shrink-0 rounded-xl border border-outline-variant/20 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-full bg-surface-container"><img src={d.img} alt={d.name} className="h-full w-full object-cover" /></div>
                    <div className="flex-1"><h4 className="text-label-md font-bold">{d.name}</h4><p className="text-caption text-on-surface-variant">{d.spec}</p></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="text-label-md">{d.rating}</span></div>
                    <span className="text-label-md font-bold text-primary">{d.fee} ج.م</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Labs slider */}
          <section className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-headline-md text-on-background">المختبرات والأشعة</h2><Link href="/labs" className="text-label-md text-primary">عرض الكل</Link></div>
            <div className="-mx-margin-mobile flex gap-4 overflow-x-auto px-margin-mobile pb-4" style={{ scrollbarWidth: "none" }}>
              {LABS_MOBILE.map((l) => (
                <div key={l.name} className="w-48 flex-shrink-0 overflow-hidden rounded-xl border border-outline-variant/20 bg-white shadow-sm">
                  <div className="relative h-28"><img src={l.img} alt={l.name} className="h-full w-full object-cover" />{l.badge && <div className="absolute right-2 top-2 rounded bg-white/90 px-2 py-1 text-caption text-primary">{l.badge}</div>}</div>
                  <div className="p-3"><h4 className="truncate text-label-md font-bold">{l.name}</h4><p className="text-caption text-on-surface-variant">{l.desc}</p></div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Bottom nav */}
        <nav className="fixed bottom-0 z-50 flex h-20 w-full items-center justify-around rounded-t-xl border-t border-outline-variant bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
          <Link href="/" className="flex flex-col items-center rounded-full bg-primary-container px-4 py-1 text-on-primary-container"><span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>home</span><span className="text-[10px]">الرئيسية</span></Link>
          <Link href="/login" className="flex flex-col items-center p-2 text-on-secondary-container"><span className="material-symbols-outlined text-2xl">calendar_today</span><span className="text-[10px]">مواعيدي</span></Link>
          <Link href="/doctors" className="flex flex-col items-center p-2 text-on-secondary-container"><span className="material-symbols-outlined text-2xl">medical_services</span><span className="text-[10px]">التخصصات</span></Link>
          <Link href="/login" className="flex flex-col items-center p-2 text-on-secondary-container"><span className="material-symbols-outlined text-2xl">person</span><span className="text-[10px]">حسابي</span></Link>
        </nav>

        {/* Floating chat button */}
        <Link href="/login" className="fixed bottom-24 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg active:scale-90"><span className="material-symbols-outlined text-2xl">chat</span></Link>
      </div>

      {/* Shared footer (responsive) — same on every page */}
      <PublicFooter />
    </div>
  );
}
