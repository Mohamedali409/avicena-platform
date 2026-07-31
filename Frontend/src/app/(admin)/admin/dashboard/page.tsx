"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/features/admin/api";

const CARDS = [
  { key: "doctors", label: "الأطباء", icon: "stethoscope", href: "/admin/doctors" },
  { key: "users", label: "المستخدمون", icon: "groups", href: "/admin/users" },
  { key: "labs", label: "المعامل", icon: "biotech", href: "/admin/labs" },
  { key: "appointments", label: "المواعيد", icon: "calendar_month", href: "/admin/appointments" },
  { key: "consultations", label: "الاستشارات", icon: "clinical_notes", href: "/admin/appointments" },
  { key: "reports", label: "التقارير", icon: "description", href: "/admin/reports" },
] as const;

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="text-headline-lg text-on-surface">لوحة تحكم الإدارة</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          نظرة عامة على منصة ابن سينا.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {CARDS.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className="flex flex-col items-start gap-3 rounded-xl bg-white p-5 shadow-card transition-all hover:shadow-card-hover"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-primary">
              <span className="material-symbols-outlined">{c.icon}</span>
            </div>
            <div>
              <p className="text-headline-md text-on-surface">
                {isLoading ? "—" : (data?.[c.key] ?? 0)}
              </p>
              <p className="text-caption text-on-surface-variant">{c.label}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-card">
          <h2 className="mb-4 text-headline-md text-on-surface">أحدث المواعيد</h2>
          {isLoading ? (
            <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
          ) : (data?.lastAppointment?.length ?? 0) === 0 ? (
            <p className="text-caption text-on-surface-variant">لا توجد مواعيد.</p>
          ) : (
            <ul className="divide-y divide-outline-variant">
              {data!.lastAppointment.map((a, i) => (
                <li key={i} className="flex items-center justify-between py-3 text-body-md">
                  <span className="text-on-surface">
                    {String((a.userData as { name?: string })?.name ?? "مريض")}
                  </span>
                  <span className="text-caption text-on-surface-variant">
                    {String(a.slotDate ?? "")} {String(a.slotTime ?? "")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-card">
          <h2 className="mb-4 text-headline-md text-on-surface">أحدث الاستشارات</h2>
          {isLoading ? (
            <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
          ) : (data?.lastConsultation?.length ?? 0) === 0 ? (
            <p className="text-caption text-on-surface-variant">لا توجد استشارات.</p>
          ) : (
            <ul className="divide-y divide-outline-variant">
              {data!.lastConsultation.map((c, i) => (
                <li key={i} className="flex items-center justify-between py-3 text-body-md">
                  <span className="text-on-surface">
                    {String((c.userData as { name?: string })?.name ?? "مريض")}
                  </span>
                  <span className="text-caption text-on-surface-variant">
                    {String(c.consultDay ?? "")} {String(c.consultTime ?? "")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
