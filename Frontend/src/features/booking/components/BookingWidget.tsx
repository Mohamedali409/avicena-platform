"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAvailableSlots, bookAppointment } from "@/features/booking/api";
import type { VisitType } from "@/features/booking/api";
import type { Doctor } from "@/features/doctors/api";
import { useAuth } from "@/store/auth.store";

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

// "14:30" → "2:30 م"
const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const period = h < 12 ? "ص" : "م";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2, "0")} ${period}`;
};

export function BookingWidget({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const qc = useQueryClient();
  const session = useAuth((s) => s.session);

  // next 7 days
  const days = useMemo(() => {
    const base = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, []);

  const [date, setDate] = useState<string>(() => toISO(days[0]));
  const [time, setTime] = useState<string | null>(null);
  const [visitType, setVisitType] = useState<VisitType>("examination");

  const hasConsultation = doctor.consultation_fees != null;
  const price =
    visitType === "consultation"
      ? (doctor.consultation_fees ?? doctor.fees)
      : doctor.fees;

  const { data: slots, isLoading } = useQuery({
    queryKey: ["slots", doctor._id, date],
    queryFn: () => getAvailableSlots(doctor._id, date),
  });

  const book = useMutation({
    mutationFn: () => bookAppointment(doctor._id, date, time!, visitType),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["slots", doctor._id, date] });
      setTime(null);
    },
  });

  const confirm = () => {
    if (!session) {
      router.push("/login?role=patient");
      return;
    }
    if (session.role !== "patient") return;
    if (time) book.mutate();
  };

  const available = slots?.available ?? [];

  return (
    <div className="rounded-xl border-t-4 border-primary bg-white p-6 shadow-card md:p-8">
      <h2 className="mb-6 flex items-center gap-2 text-headline-md text-on-surface">
        <span className="material-symbols-outlined text-primary">calendar_month</span>
        احجز موعدك الآن
      </h2>

      {/* Visit type */}
      <div className="mb-6 space-y-3">
        <label className="block text-label-md text-on-surface-variant">نوع الزيارة</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setVisitType("examination")}
            className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition-all ${
              visitType === "examination"
                ? "border-primary bg-surface-container-low text-primary"
                : "border-outline-variant text-on-surface-variant hover:border-primary"
            }`}
          >
            <span className="material-symbols-outlined">stethoscope</span>
            <span className="text-caption font-medium">كشف</span>
            <span className="text-caption">{doctor.fees} ج.م</span>
          </button>
          <button
            type="button"
            disabled={!hasConsultation}
            onClick={() => setVisitType("consultation")}
            className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition-all disabled:opacity-40 ${
              visitType === "consultation"
                ? "border-primary bg-surface-container-low text-primary"
                : "border-outline-variant text-on-surface-variant hover:border-primary"
            }`}
          >
            <span className="material-symbols-outlined">videocam</span>
            <span className="text-caption font-medium">استشارة</span>
            <span className="text-caption">
              {hasConsultation ? `${doctor.consultation_fees} ج.م` : "غير متاح"}
            </span>
          </button>
        </div>
      </div>

      {/* Dates */}
      <div className="mb-6 space-y-3">
        <label className="block text-label-md text-on-surface-variant">اختر التاريخ</label>
        <div className="grid grid-cols-4 gap-2">
          {days.map((d, i) => {
            const iso = toISO(d);
            const selected = iso === date;
            return (
              <button
                key={iso}
                onClick={() => {
                  setDate(iso);
                  setTime(null);
                }}
                className={`flex flex-col items-center rounded-lg p-2 transition-colors ${
                  selected
                    ? "border-2 border-primary bg-surface-container-low text-primary"
                    : "border border-outline-variant hover:border-primary"
                }`}
              >
                <span className="text-caption">
                  {i === 0
                    ? "اليوم"
                    : d.toLocaleDateString("ar-EG", { weekday: "short" })}
                </span>
                <span className="text-body-md font-bold">{d.getDate()}</span>
                <span className="text-caption">
                  {d.toLocaleDateString("ar-EG", { month: "short" })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slots */}
      <div className="mb-6 space-y-3">
        <label className="block text-label-md text-on-surface-variant">المواعيد المتاحة</label>

        {isLoading && (
          <p className="text-caption text-on-surface-variant">جارٍ تحميل المواعيد…</p>
        )}

        {!isLoading && available.length === 0 && (
          <p className="rounded-lg bg-surface-container-low p-3 text-center text-caption text-on-surface-variant">
            لا توجد مواعيد متاحة في هذا اليوم
          </p>
        )}

        {available.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {available.map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`rounded-lg border py-2 text-center text-body-md transition-all ${
                  time === t
                    ? "border-primary bg-primary-container text-white"
                    : "border-outline-variant hover:bg-primary-container hover:text-white"
                }`}
              >
                {fmtTime(t)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Confirm */}
      <div className="space-y-4 border-t border-outline-variant pt-6">
        <div className="flex items-center justify-between">
          <span className="text-body-md text-on-surface-variant">
            {visitType === "consultation" ? "رسوم الاستشارة" : "رسوم الكشف"}
          </span>
          <span className="text-headline-md text-primary">
            {(price ?? 0).toLocaleString("ar-EG")} ج.م
          </span>
        </div>

        {book.isSuccess ? (
          <div className="rounded-xl bg-primary-container p-4 text-center text-white">
            <span className="material-symbols-outlined">check_circle</span>
            <p className="mt-1 text-label-md">تم تأكيد حجزك بنجاح</p>
            <Link
              href="/patient/appointments"
              className="mt-2 inline-block text-caption underline"
            >
              عرض مواعيدي
            </Link>
          </div>
        ) : (
          <>
            <button
              onClick={confirm}
              disabled={(!!session && !time) || book.isPending}
              className="block w-full rounded-xl bg-primary-container py-4 text-center text-label-md text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            >
              {book.isPending
                ? "جارٍ الحجز…"
                : !session
                  ? "سجّل الدخول للحجز"
                  : "تأكيد الحجز"}
            </button>

            {book.isError && (
              <p className="text-center text-caption text-error">
                تعذّر إتمام الحجز، حاول مرة أخرى
              </p>
            )}
            <p className="text-center text-caption text-on-surface-variant">
              * لا يتم خصم المبلغ إلا بعد إتمام الزيارة
            </p>
          </>
        )}
      </div>
    </div>
  );
}
