"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/features/patient/api";
import { listAppointments } from "@/features/booking/api";
import { useAuth } from "@/store/auth.store";

const STAT_CARDS = [
  { key: "appointments", label: "المواعيد", icon: "calendar_month", href: "/patient/appointments" },
  { key: "consultations", label: "الاستشارات", icon: "clinical_notes", href: "/patient/consultations" },
  { key: "reports", label: "التقارير", icon: "description", href: "/patient/reports" },
] as const;

const ACTIONS = [
  {
    label: "احجز موعد",
    desc: "تصفّح الأطباء واحجز أقرب موعد",
    icon: "event_available",
    href: "/doctors",
    primary: true,
  },
  {
    label: "المحادثات",
    desc: "تواصل مع طبيبك قرب موعدك",
    icon: "forum",
    href: "/patient/chat",
    primary: false,
  },
  {
    label: "تقاريري الطبية",
    desc: "اطّلع على تقاريرك ونتائجك",
    icon: "description",
    href: "/patient/reports",
    primary: false,
  },
];

export default function PatientDashboard() {
  const name = useAuth((s) => s.session?.user.name);
  const { data: stats } = useQuery({
    queryKey: ["patient-stats"],
    queryFn: getStats,
  });
  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => listAppointments(1, 50),
  });
  const upcoming = appointments
    .filter((a) => !a.cancelled && !a.isCompleted)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Greeting */}
      <header>
        <h1 className="text-headline-lg text-on-surface">
          أهلاً، {name ?? "بك"} 👋
        </h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          هنا ملخّص نشاطك الصحي وأهم الإجراءات السريعة.
        </p>
      </header>

      {/* Stat tiles */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STAT_CARDS.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-card transition-all hover:shadow-card-hover"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-primary">
              <span className="material-symbols-outlined">{c.icon}</span>
            </div>
            <div>
              <p className="text-headline-md text-on-surface">
                {stats ? (stats[c.key] ?? 0) : "—"}
              </p>
              <p className="text-caption text-on-surface-variant">{c.label}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Upcoming appointments */}
      {upcoming.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-headline-md text-on-surface">مواعيدك القادمة</h2>
            <Link href="/patient/appointments" className="text-caption text-primary hover:underline">
              عرض الكل
            </Link>
          </div>
          <ul className="space-y-2">
            {upcoming.map((a) => {
              const doc = a.docData as { doctorName?: string; specialization?: string } | undefined;
              return (
                <li
                  key={a._id}
                  className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-card"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-primary">
                    <span className="material-symbols-outlined">stethoscope</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-label-md text-on-surface">
                      د. {doc?.doctorName ?? "طبيب"}
                    </p>
                    <p className="text-caption text-on-surface-variant">
                      {a.slotDate} — {a.slotTime}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Quick actions */}
      <section className="space-y-4">
        <h2 className="text-headline-md text-on-surface">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`group flex flex-col gap-3 rounded-xl p-6 shadow-card transition-all hover:shadow-card-hover ${
                a.primary
                  ? "bg-primary-container text-white"
                  : "bg-white text-on-surface"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[32px] ${
                  a.primary ? "text-white" : "text-primary"
                }`}
              >
                {a.icon}
              </span>
              <div>
                <p className="text-label-md">{a.label}</p>
                <p
                  className={`mt-1 text-caption ${
                    a.primary ? "text-white/80" : "text-on-surface-variant"
                  }`}
                >
                  {a.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
