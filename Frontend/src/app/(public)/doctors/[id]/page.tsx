"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { MobileBottomNav } from "@/components/public/MobileBottomNav";
import { getDoctor } from "@/features/doctors/api";
import { BookingWidget } from "@/features/booking/components/BookingWidget";

const HOURS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: doctor, isLoading } = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctor(id),
    enabled: !!id,
  });

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

  const workLabel = doctor?.start_booked
    ? `${doctor.start_booked.from}:00 - ${doctor.start_booked.to}:00`
    : "—";

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
          <span className="font-medium text-primary">
            {doctor ? `د. ${doctor.doctorName}` : "…"}
          </span>
        </nav>

        {isLoading && (
          <p className="py-20 text-center text-on-surface-variant">جارٍ تحميل بيانات الطبيب…</p>
        )}

        {!isLoading && !doctor && (
          <div className="rounded-xl bg-white p-12 text-center shadow-card">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
              person_off
            </span>
            <p className="mt-2 text-body-md text-on-surface-variant">الطبيب غير موجود</p>
            <Link href="/doctors" className="mt-4 inline-block text-primary underline">
              العودة لقائمة الأطباء
            </Link>
          </div>
        )}

        {doctor && (
          <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-10">
            {/* Info column */}
            <div className="space-y-gutter lg:col-span-6">
              {/* Profile hero */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-outline-variant/20">
                <div className="h-24 bg-gradient-to-l from-primary to-primary-container" />
                <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
                  <div className="relative -mt-20 flex-shrink-0 self-center md:self-start">
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl bg-surface-container text-primary ring-4 ring-white md:h-36 md:w-36">
                      {doctor.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={doctor.image} alt={doctor.doctorName} className="h-full w-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-[64px]">stethoscope</span>
                      )}
                    </div>
                    {doctor.available && (
                      <span className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-green-500 px-3 py-1 text-caption text-white shadow-lg">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        متاح الآن
                      </span>
                    )}
                  </div>

                  <div className="flex-grow space-y-4 md:pt-2">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="text-headline-lg text-on-surface">د. {doctor.doctorName}</h1>
                          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        </div>
                        <span className="mt-2 inline-block rounded-full bg-surface-container-low px-3 py-1 text-caption font-medium text-primary">
                          {doctor.specialization}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5">
                        <span className="material-symbols-outlined text-[16px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-label-md font-bold text-on-surface">4.8</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-4 sm:grid-cols-3">
                      {stat("work_history", "الخبرة", doctor.expertise ? `${doctor.expertise}+ سنة` : "—")}
                      {stat("school", "الدرجة", doctor.degree ?? "—")}
                      {stat("location_on", "المدينة", doctor.address?.city ?? "—")}
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-outline-variant pt-4">
                      <span className="flex items-center gap-1.5 rounded-xl bg-primary-container/10 px-4 py-2 text-body-md">
                        <span className="material-symbols-outlined text-[18px] text-primary">payments</span>
                        <span className="text-on-surface-variant">الكشف</span>
                        <span className="font-bold text-primary">{doctor.fees} ج.م</span>
                      </span>
                      {doctor.consultation_fees != null && (
                        <span className="flex items-center gap-1.5 rounded-xl bg-primary-container/10 px-4 py-2 text-body-md">
                          <span className="material-symbols-outlined text-[18px] text-primary">videocam</span>
                          <span className="text-on-surface-variant">الاستشارة</span>
                          <span className="font-bold text-primary">{doctor.consultation_fees} ج.م</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-outline-variant/20 md:p-8">
                <h3 className="mb-4 flex items-center gap-2 text-headline-md text-on-surface">
                  <span className="material-symbols-outlined text-primary">badge</span>
                  نبذة عن الطبيب
                </h3>
                <p className="text-body-md leading-relaxed text-on-surface-variant">
                  {doctor.about || "لا توجد نبذة متاحة."}
                </p>
                {(doctor.address?.line1 || doctor.address?.city) && (
                  <p className="mt-4 flex items-center gap-2 border-t border-outline-variant pt-4 text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                    {[doctor.address?.line1, doctor.address?.line2, doctor.address?.city]
                      .filter(Boolean)
                      .join("، ")}
                  </p>
                )}
              </div>

              {/* Working hours */}
              <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-outline-variant/20 md:p-8">
                <h3 className="mb-4 flex items-center gap-2 text-headline-md text-on-surface">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  مواعيد العمل
                </h3>
                <div className="divide-y divide-outline-variant">
                  {HOURS.map((d) => (
                    <div key={d} className="flex items-center justify-between py-3">
                      <span className="text-body-md">{d}</span>
                      <span className="font-medium text-primary">{workLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking widget (real) */}
            <aside className="sticky top-24 lg:col-span-4">
              <BookingWidget doctor={doctor} />
            </aside>
          </div>
        )}
      </main>

      <MobileBottomNav active="specialties" />
      <PublicFooter />
    </div>
  );
}
