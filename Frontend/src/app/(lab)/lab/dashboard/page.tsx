"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getLabProfile } from "@/features/labs/portal.api";

export default function LabDashboard() {
  const { data: lab, isLoading } = useQuery({
    queryKey: ["lab-profile"],
    queryFn: getLabProfile,
  });

  const testsCount = lab?.tests?.length ?? 0;
  const hours = lab?.workingHours
    ? `${lab.workingHours.from} - ${lab.workingHours.to}`
    : "—";

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <h1 className="text-headline-lg text-on-surface">
          {lab ? lab.name : "لوحة تحكم المعمل"}
        </h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          ملخّص معملك وأهم الإجراءات.
        </p>
      </header>

      {isLoading && (
        <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
      )}

      {/* Status + stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-primary">
            <span className="material-symbols-outlined">labs</span>
          </div>
          <div>
            <p className="text-headline-md text-on-surface">{testsCount}</p>
            <p className="text-caption text-on-surface-variant">عدد التحاليل</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-primary">
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <div>
            <p className="text-label-md text-on-surface">{hours}</p>
            <p className="text-caption text-on-surface-variant">ساعات العمل</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-card">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              lab?.isVerified
                ? "bg-primary-container text-white"
                : "bg-error-container text-on-error-container"
            }`}
          >
            <span className="material-symbols-outlined">
              {lab?.isVerified ? "verified" : "pending"}
            </span>
          </div>
          <div>
            <p className="text-label-md text-on-surface">
              {lab?.isVerified ? "موثّق" : "قيد المراجعة"}
            </p>
            <p className="text-caption text-on-surface-variant">حالة التوثيق</p>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          { label: "ملف المعمل", desc: "حدّث بيانات معملك", icon: "biotech", href: "/lab/profile" },
          { label: "قائمة التحاليل", desc: "أدر التحاليل والأسعار", icon: "labs", href: "/lab/tests" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-card transition-all hover:shadow-card-hover"
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
      </section>
    </div>
  );
}
