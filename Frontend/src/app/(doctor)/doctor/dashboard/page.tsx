"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/features/doctor/api";
import { useAuth } from "@/store/auth.store";

const money = (n: number) => `${(n ?? 0).toLocaleString("ar-EG")} ج.م`;

export default function DoctorDashboard() {
  const name = useAuth((s) => s.session?.user.name);
  const { data, isLoading } = useQuery({
    queryKey: ["doctor-dashboard"],
    queryFn: getDashboard,
  });

  const stats = [
    { label: "إجمالي المواعيد", value: data?.appointments ?? "—", icon: "calendar_month" },
    { label: "عدد المرضى", value: data?.patients ?? "—", icon: "groups" },
    { label: "مرضى الاستشارات", value: data?.consultations_patients ?? "—", icon: "clinical_notes" },
  ];

  const earnings = [
    { label: "أرباح المواعيد", value: data ? money(data.earnings_appointments) : "—", icon: "payments" },
    { label: "أرباح الاستشارات", value: data ? money(data.earnings_consultations) : "—", icon: "account_balance_wallet" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="text-headline-lg text-on-surface">
          أهلاً، {name ?? "دكتور"} 🩺
        </h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          ملخّص عيادتك وأهم الإجراءات السريعة.
        </p>
      </header>

      {/* Earnings */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {earnings.map((e) => (
          <div
            key={e.label}
            className="flex items-center gap-4 rounded-xl bg-primary-container p-6 text-white shadow-card"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
              <span className="material-symbols-outlined">{e.icon}</span>
            </div>
            <div>
              <p className="text-headline-md">{e.value}</p>
              <p className="text-caption text-white/80">{e.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Counts */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-card"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-primary">
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <div>
              <p className="text-headline-md text-on-surface">{s.value}</p>
              <p className="text-caption text-on-surface-variant">{s.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Quick actions */}
      <section className="space-y-4">
        <h2 className="text-headline-md text-on-surface">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: "المواعيد", desc: "استعرض وأدر مواعيدك", icon: "calendar_month", href: "/doctor/appointments" },
            { label: "المحادثات", desc: "تواصل مع مرضاك + مساعد AI", icon: "forum", href: "/doctor/chat" },
            { label: "التقارير", desc: "اكتب واستعرض تقارير المرضى", icon: "description", href: "/doctor/reports" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow-card transition-all hover:shadow-card-hover"
            >
              <span className="material-symbols-outlined text-[32px] text-primary">
                {a.icon}
              </span>
              <div>
                <p className="text-label-md text-on-surface">{a.label}</p>
                <p className="mt-1 text-caption text-on-surface-variant">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentList
          title="أحدث المواعيد"
          rows={data?.lastAppointments}
          dateKey="slotDate"
          timeKey="slotTime"
        />
        <RecentList
          title="أحدث الاستشارات"
          rows={data?.lastConsultations}
          dateKey="consultDay"
          timeKey="consultTime"
        />
      </section>

      {isLoading && (
        <p className="text-caption text-on-surface-variant">جارٍ تحميل البيانات…</p>
      )}
    </div>
  );
}

function RecentList({
  title,
  rows,
  dateKey,
  timeKey,
}: {
  title: string;
  rows?: Array<Record<string, unknown>>;
  dateKey: string;
  timeKey: string;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-card">
      <h2 className="mb-4 text-headline-md text-on-surface">{title}</h2>
      {!rows || rows.length === 0 ? (
        <p className="text-caption text-on-surface-variant">لا يوجد.</p>
      ) : (
        <ul className="divide-y divide-outline-variant">
          {rows.map((r, i) => (
            <li key={i} className="flex items-center justify-between py-3 text-body-md">
              <span className="text-on-surface">
                {String((r.userData as { name?: string })?.name ?? "مريض")}
              </span>
              <span className="text-caption text-on-surface-variant">
                {String(r[dateKey] ?? "")} {String(r[timeKey] ?? "")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
