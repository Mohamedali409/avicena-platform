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

const STATS = [
  { icon: "groups", value: "+10,000", label: "مريض" },
  { icon: "stethoscope", value: "+500", label: "طبيب معتمد" },
  { icon: "biotech", value: "+50", label: "معمل وصيدلية" },
  { icon: "schedule", value: "24/7", label: "دعم متواصل" },
];

const SPECIALTIES = [
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
const DOCS = [
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
const LABS = [
  { name: "مختبرات البرج", loc: "القاهرة، مدينة نصر", rating: "4.9", img: IMG.labBurj },
  { name: "مختبرات ألفا", loc: "الجيزة، المهندسين", rating: "4.8", img: IMG.labAlpha },
  { name: "المختبر الحديث", loc: "الإسكندرية، سموحة", rating: "5.0", img: IMG.labBurj },
  { name: "مختبر العناية", loc: "القاهرة، المعادي", rating: "4.7", img: IMG.labAlpha },
];

// small reusable section heading
function Heading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10 text-center">
      <span className="mb-3 inline-block rounded-full bg-primary-container/10 px-4 py-1 text-sm font-semibold text-primary-container">{eyebrow}</span>
      <h2 className="text-3xl font-extrabold text-on-surface md:text-4xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-on-surface-variant">{subtitle}</p>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface">
      <PublicHeader active="home" />

      {/* ============ DESKTOP ============ */}
      <div className="hidden md:block">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-surface-container-low via-background to-primary-container/10">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="mx-auto grid max-w-container-max grid-cols-2 items-center gap-12 px-margin-desktop py-20">
            <div className="text-right">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-container/20 bg-white px-4 py-1.5 text-primary-container shadow-sm">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="text-sm font-semibold">موثوق من قبل +10,000 مريض</span>
              </div>
              <h1 className="mb-6 text-5xl font-extrabold leading-[1.15] text-on-surface">
                رعايتك الصحية <span className="text-primary-container">عن بُعد</span><br />بكل خصوصية وأمان
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-on-surface-variant">
                احجز مع نخبة الأطباء، اعمل تحاليلك، واطلب أدويتك — كل رعايتك الصحية في مكان واحد.
              </p>

              <div className="flex max-w-2xl items-center gap-2 rounded-2xl bg-white p-2 shadow-card ring-1 ring-outline-variant/40">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                  <input type="text" placeholder="ابحث عن تخصص، طبيب أو حالة..." className="w-full rounded-xl border-none bg-transparent py-3.5 pr-12 pl-4 outline-none placeholder:text-outline focus:ring-0" />
                </div>
                <Link href="/doctors" className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-primary-container px-7 py-3.5 font-bold text-white transition-all hover:brightness-105 active:scale-95">
                  احجز الآن <span className="material-symbols-outlined">arrow_back</span>
                </Link>
              </div>

              <div className="mt-6 flex flex-row-reverse items-center gap-6 text-on-surface-variant">
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary-container">bolt</span>رد خلال 15 دقيقة</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary-container">verified_user</span>مشفّر وآمن</span>
              </div>
            </div>

            {/* visual */}
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] shadow-2xl">
              <img src={IMG.heroDoc} alt="طبيب" className="h-full w-full object-cover" />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/20 bg-white/85 p-4 shadow-lg backdrop-blur">
                <div className="flex flex-row-reverse items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span></div>
                  <div className="text-right"><p className="font-bold text-primary">استشارة طارئة متاحة</p><p className="text-sm text-on-surface-variant">د. أحمد سليم — متصل الآن</p></div>
                </div>
              </div>
            </div>
          </div>

          {/* stats strip */}
          <div className="mx-auto max-w-container-max px-margin-desktop pb-16">
            <div className="grid grid-cols-4 gap-4 rounded-2xl border border-outline-variant/30 bg-white p-6 shadow-card">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-center justify-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container/10 text-primary-container"><span className="material-symbols-outlined">{s.icon}</span></div>
                  <div className="text-right"><p className="text-2xl font-extrabold text-on-surface">{s.value}</p><p className="text-sm text-on-surface-variant">{s.label}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialties */}
        <section className="mx-auto max-w-container-max px-margin-desktop py-20">
          <Heading eyebrow="التخصصات" title="ابحث حسب التخصص" subtitle="اختر التخصص المناسب واحجز مع أفضل الأطباء في مجالهم" />
          <div className="grid grid-cols-6 gap-5">
            {SPECIALTIES.map((s) => (
              <Link key={s.label} href="/doctors" className="group rounded-2xl border border-outline-variant/30 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-container/40 hover:shadow-card">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/10 text-primary-container transition-all group-hover:scale-110 group-hover:bg-primary-container group-hover:text-white"><span className="material-symbols-outlined text-3xl">{s.icon}</span></div>
                <h4 className="font-bold text-on-surface">{s.label}</h4>
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="bg-surface-container-low/50 py-20">
          <div className="mx-auto max-w-container-max px-margin-desktop">
            <Heading eyebrow="لماذا ابن سينا؟" title="تجربة رعاية صحية متكاملة" subtitle="نجمع التكنولوجيا المتطورة والخبرة الطبية لتجربة علاجية لا تُضاهى" />
            <div className="grid grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <div key={f.title} className={`group flex flex-col items-center rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1.5 ${f.accent ? "bg-primary-container text-white shadow-xl shadow-primary-container/25" : "border border-outline-variant/30 bg-white shadow-sm hover:shadow-card"}`}>
                  <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${f.accent ? "bg-white/20" : "bg-primary-container/10 text-primary-container"}`}><span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{f.icon}</span></div>
                  <h4 className={`mb-3 text-xl font-bold ${f.accent ? "" : "text-primary"}`}>{f.title}</h4>
                  <p className={f.accent ? "opacity-90" : "text-on-surface-variant"}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Doctors */}
        <section className="mx-auto max-w-container-max px-margin-desktop py-20">
          <div className="mb-10 flex flex-row-reverse items-end justify-between">
            <div className="text-right">
              <span className="mb-2 inline-block rounded-full bg-primary-container/10 px-4 py-1 text-sm font-semibold text-primary-container">الأطباء</span>
              <h2 className="text-3xl font-extrabold text-on-surface md:text-4xl">نخبة الأطباء المتخصصين</h2>
            </div>
            <Link href="/doctors" className="flex items-center gap-1 rounded-xl border border-primary px-5 py-2.5 font-semibold text-primary transition-all hover:bg-primary hover:text-white">عرض الكل <span className="material-symbols-outlined text-[18px]">arrow_back</span></Link>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {DOCS.map((d) => (
              <div key={d.name} className="group overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
                <div className="relative h-56 overflow-hidden">
                  <img src={d.img} alt={d.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 shadow-sm backdrop-blur"><span className="material-symbols-outlined text-sm text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="text-sm font-bold">{d.rating}</span></div>
                </div>
                <div className="p-5 text-right">
                  <h5 className="mb-1 text-lg font-bold text-on-surface transition-colors group-hover:text-primary">{d.name}</h5>
                  <p className="mb-4 text-sm font-medium text-primary-container">{d.spec}</p>
                  <div className="flex flex-row-reverse items-center justify-between border-t border-outline-variant/30 pt-4">
                    <span className="text-sm text-on-surface-variant">خبرة +{d.exp} عاماً</span>
                    <Link href="/doctors" className="flex items-center gap-1 rounded-lg bg-primary-container/10 px-3 py-1.5 text-sm font-semibold text-primary-container transition-all hover:bg-primary-container hover:text-white">احجز <span className="material-symbols-outlined text-[16px]">calendar_add_on</span></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Labs */}
        <section className="bg-surface-container-low/50 py-20">
          <div className="mx-auto max-w-container-max px-margin-desktop">
            <div className="mb-10 flex flex-row-reverse items-end justify-between">
              <div className="text-right">
                <span className="mb-2 inline-block rounded-full bg-primary-container/10 px-4 py-1 text-sm font-semibold text-primary-container">المعامل</span>
                <h2 className="text-3xl font-extrabold text-on-surface md:text-4xl">المختبرات المتميزة</h2>
              </div>
              <Link href="/labs" className="flex items-center gap-1 rounded-xl border border-primary px-5 py-2.5 font-semibold text-primary transition-all hover:bg-primary hover:text-white">عرض الكل <span className="material-symbols-outlined text-[18px]">arrow_back</span></Link>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {LABS.map((l) => (
                <div key={l.name} className="group overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
                  <div className="relative h-44 overflow-hidden">
                    <img src={l.img} alt={l.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 shadow-sm"><span className="material-symbols-outlined text-sm text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="text-sm font-bold">{l.rating}</span></div>
                  </div>
                  <div className="p-5 text-right">
                    <h5 className="mb-1 text-lg font-bold text-on-surface transition-colors group-hover:text-primary">{l.name}</h5>
                    <p className="mb-4 flex items-center justify-end gap-1 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">location_on</span>{l.loc}</p>
                    <Link href="/labs" className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container py-2.5 text-sm font-semibold text-white transition-all hover:brightness-105 active:scale-95">احجز فحصاً <span className="material-symbols-outlined text-[16px]">arrow_back</span></Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-margin-desktop py-20">
          <div className="relative mx-auto max-w-container-max overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-container to-primary p-12 text-white shadow-xl">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row-reverse">
              <div className="max-w-xl text-right">
                <h3 className="mb-3 text-3xl font-extrabold">هل أنت طبيب أو معمل أو صيدلية؟</h3>
                <p className="text-lg opacity-90">انضم إلى شبكة ابن سينا ووسّع وصولك لآلاف المرضى. ابدأ اليوم.</p>
              </div>
              <Link href="/login" className="whitespace-nowrap rounded-xl bg-white px-10 py-4 font-bold text-primary shadow-xl transition-all hover:scale-105 active:scale-95">سجّل الآن</Link>
            </div>
          </div>
        </section>
      </div>

      {/* ============ MOBILE ============ */}
      <div className="md:hidden">
        <main className="mt-16 space-y-8 px-margin-mobile pb-28">
          <section className="pt-6">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary-container/10 px-3 py-1 text-xs font-semibold text-primary-container">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> +10,000 مريض يثقون بنا
            </div>
            <h1 className="text-2xl font-extrabold leading-snug text-on-background">رعايتك الصحية <span className="text-primary-container">عن بُعد</span></h1>
            <p className="mt-2 max-w-[85%] text-sm text-on-surface-variant">أطباء ومعامل وصيدليات في مكان واحد.</p>
            <div className="relative mt-5">
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input type="text" placeholder="ابحث عن طبيب أو تخصص..." className="h-14 w-full rounded-2xl border-none bg-white pr-12 pl-20 text-sm shadow-card focus:ring-2 focus:ring-primary-container" />
              <Link href="/doctors" className="absolute inset-y-2 left-2 flex items-center rounded-xl bg-primary-container px-4 text-sm font-bold text-white">بحث</Link>
            </div>
          </section>

          {/* stats */}
          <section className="grid grid-cols-2 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-2 rounded-2xl border border-outline-variant/30 bg-white p-3 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-container/10 text-primary-container"><span className="material-symbols-outlined text-[20px]">{s.icon}</span></div>
                <div><p className="text-lg font-extrabold leading-none text-on-surface">{s.value}</p><p className="text-xs text-on-surface-variant">{s.label}</p></div>
              </div>
            ))}
          </section>

          {/* specialties scroll */}
          <section className="-mx-margin-mobile space-y-3 px-margin-mobile">
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-on-background">التخصصات</h2><Link href="/doctors" className="text-sm font-semibold text-primary">الكل</Link></div>
            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {SPEC_MOBILE.map((s) => (
                <Link key={s.label} href="/doctors" className="group flex flex-shrink-0 flex-col items-center gap-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/10 text-primary-container shadow-sm transition-transform group-active:scale-90"><span className="material-symbols-outlined text-3xl">{s.icon}</span></div>
                  <span className="text-xs font-medium text-on-surface-variant">{s.label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* quick actions */}
          <section className="grid grid-cols-1 gap-3">
            <Link href="/doctors" className="relative flex items-center justify-between overflow-hidden rounded-2xl bg-primary-container p-5 text-white">
              <div><h3 className="text-lg font-bold">حجز فوري</h3><p className="text-sm opacity-90">استشارة خلال 5 دقائق</p><span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">ابدأ الآن <span className="material-symbols-outlined text-sm">arrow_back</span></span></div>
              <span className="material-symbols-outlined absolute -bottom-3 -left-3 rotate-12 text-8xl opacity-10">bolt</span>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              {[["biotech", "المعامل", "/labs"], ["local_pharmacy", "الصيدليات", "/pharmacies"]].map(([icon, title, href]) => (
                <Link key={title} href={href} className="space-y-2 rounded-2xl border border-outline-variant/30 bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container/10 text-primary-container"><span className="material-symbols-outlined">{icon}</span></div>
                  <p className="font-bold text-on-surface">{title}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* doctors slider */}
          <section className="space-y-3">
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-on-background">أطباء متميزون</h2><Link href="/doctors" className="text-sm font-semibold text-primary">عرض الكل</Link></div>
            <div className="-mx-margin-mobile flex gap-4 overflow-x-auto px-margin-mobile pb-4" style={{ scrollbarWidth: "none" }}>
              {DOCS_MOBILE.map((d) => (
                <div key={d.name} className="w-64 flex-shrink-0 rounded-2xl border border-outline-variant/20 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-full bg-surface-container"><img src={d.img} alt={d.name} className="h-full w-full object-cover" /></div>
                    <div className="flex-1"><h4 className="font-bold">{d.name}</h4><p className="text-xs text-on-surface-variant">{d.spec}</p></div>
                  </div>
                  <div className="flex items-center justify-between border-t border-outline-variant/30 pt-3">
                    <div className="flex items-center gap-1 text-amber-500"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="text-sm font-semibold">{d.rating}</span></div>
                    <span className="text-sm font-bold text-primary">{d.fee} ج.م</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* labs slider */}
          <section className="space-y-3">
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-on-background">المعامل والأشعة</h2><Link href="/labs" className="text-sm font-semibold text-primary">عرض الكل</Link></div>
            <div className="-mx-margin-mobile flex gap-4 overflow-x-auto px-margin-mobile pb-4" style={{ scrollbarWidth: "none" }}>
              {LABS_MOBILE.map((l) => (
                <div key={l.name} className="w-48 flex-shrink-0 overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-sm">
                  <div className="relative h-28"><img src={l.img} alt={l.name} className="h-full w-full object-cover" />{l.badge && <div className="absolute right-2 top-2 rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold text-primary">{l.badge}</div>}</div>
                  <div className="p-3"><h4 className="truncate font-bold">{l.name}</h4><p className="text-xs text-on-surface-variant">{l.desc}</p></div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* mobile bottom nav */}
        <nav className="fixed bottom-0 z-50 flex h-20 w-full items-center justify-around rounded-t-2xl border-t border-outline-variant bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <Link href="/" className="flex flex-col items-center rounded-full bg-primary-container px-4 py-1 text-white"><span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>home</span><span className="text-[10px] font-semibold">الرئيسية</span></Link>
          <Link href="/doctors" className="flex flex-col items-center p-2 text-on-surface-variant"><span className="material-symbols-outlined text-2xl">stethoscope</span><span className="text-[10px]">الأطباء</span></Link>
          <Link href="/labs" className="flex flex-col items-center p-2 text-on-surface-variant"><span className="material-symbols-outlined text-2xl">biotech</span><span className="text-[10px]">المعامل</span></Link>
          <Link href="/login" className="flex flex-col items-center p-2 text-on-surface-variant"><span className="material-symbols-outlined text-2xl">person</span><span className="text-[10px]">حسابي</span></Link>
        </nav>
      </div>

      <PublicFooter />
    </div>
  );
}
