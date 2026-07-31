"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDoctorProfile,
  updateDoctorProfile,
  clearDoctorSlots,
} from "@/features/doctor/api";

export default function DoctorSettingsPage() {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["doctor-profile-full"],
    queryFn: getDoctorProfile,
  });

  const [form, setForm] = useState({
    available: true,
    fees: "",
    consultation_fees: "",
    phone: "",
    city: "",
    line1: "",
    line2: "",
    from: "",
    to: "",
    booking_period: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        available: profile.available ?? true,
        fees: String(profile.fees ?? ""),
        consultation_fees: String(profile.consultation_fees ?? ""),
        phone: profile.phone ?? "",
        city: profile.address?.city ?? "",
        line1: profile.address?.line1 ?? "",
        line2: profile.address?.line2 ?? "",
        from: String(profile.start_booked?.from ?? ""),
        to: String(profile.start_booked?.to ?? ""),
        booking_period: String(profile.start_booked?.booking_period ?? ""),
      });
    }
  }, [profile]);

  const save = useMutation({
    mutationFn: () =>
      updateDoctorProfile({
        available: form.available,
        fees: Number(form.fees) || 0,
        consultation_fees: Number(form.consultation_fees) || 0,
        phone: form.phone,
        address: { line1: form.line1, line2: form.line2, city: form.city },
        start_booked: {
          from: Number(form.from) || 9,
          to: Number(form.to) || 17,
          booking_period: Number(form.booking_period) || 30,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor-profile-full"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const clearSlots = useMutation({
    mutationFn: clearDoctorSlots,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["doctor-profile-full"] }),
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((s) => ({ ...s, [k]: v }));

  const field =
    "w-full rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-primary";
  const label = "mb-1 block text-label-md text-on-surface-variant";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-headline-md text-on-surface">إعدادات العيادة</h1>

      {isLoading && (
        <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
      )}

      {profile && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
          className="space-y-6 rounded-xl bg-white p-6 shadow-card"
        >
          {/* Availability toggle */}
          <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-4">
            <div>
              <p className="text-label-md text-on-surface">متاح للحجز</p>
              <p className="text-caption text-on-surface-variant">
                عند الإيقاف لن يظهر لك مواعيد متاحة للمرضى.
              </p>
            </div>
            <button
              type="button"
              onClick={() => set("available", !form.available)}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                form.available ? "bg-primary-container" : "bg-outline-variant"
              }`}
              aria-pressed={form.available}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                  form.available ? "right-1" : "right-6"
                }`}
              />
            </button>
          </div>

          {/* Fees */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>رسوم الكشف (ج.م)</label>
              <input type="number" value={form.fees} onChange={(e) => set("fees", e.target.value)} className={field} />
            </div>
            <div>
              <label className={label}>رسوم الاستشارة (ج.م)</label>
              <input type="number" value={form.consultation_fees} onChange={(e) => set("consultation_fees", e.target.value)} className={field} />
            </div>
          </div>

          {/* Working hours */}
          <div>
            <p className="mb-2 text-label-md text-on-surface">ساعات العمل والمواعيد</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={label}>من (ساعة)</label>
                <input type="number" min={0} max={23} value={form.from} onChange={(e) => set("from", e.target.value)} className={field} />
              </div>
              <div>
                <label className={label}>إلى (ساعة)</label>
                <input type="number" min={0} max={23} value={form.to} onChange={(e) => set("to", e.target.value)} className={field} />
              </div>
              <div>
                <label className={label}>مدة الموعد (دقيقة)</label>
                <input type="number" min={5} step={5} value={form.booking_period} onChange={(e) => set("booking_period", e.target.value)} className={field} />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>الهاتف</label>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={field} />
            </div>
            <div>
              <label className={label}>المدينة</label>
              <input value={form.city} onChange={(e) => set("city", e.target.value)} className={field} />
            </div>
            <div>
              <label className={label}>العنوان 1</label>
              <input value={form.line1} onChange={(e) => set("line1", e.target.value)} className={field} />
            </div>
            <div>
              <label className={label}>العنوان 2</label>
              <input value={form.line2} onChange={(e) => set("line2", e.target.value)} className={field} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={save.isPending}
              className="rounded-xl bg-primary-container px-6 py-3 text-label-md text-white disabled:opacity-40"
            >
              {save.isPending ? "جارٍ الحفظ…" : "حفظ الإعدادات"}
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-caption text-primary">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                تم الحفظ
              </span>
            )}
            {save.isError && <span className="text-caption text-error">تعذّر الحفظ</span>}
          </div>
        </form>
      )}

      {/* Danger zone */}
      {profile && (
        <div className="rounded-xl border border-error/30 bg-white p-6 shadow-card">
          <p className="text-label-md text-on-surface">مسح كل المواعيد المحجوزة</p>
          <p className="mt-1 text-caption text-on-surface-variant">
            يُفرغ جدول حجوزاتك بالكامل (لا يلغي المواعيد المسجّلة، فقط يحرّر الأوقات).
          </p>
          <button
            onClick={() => clearSlots.mutate()}
            disabled={clearSlots.isPending}
            className="mt-3 rounded-xl border border-error px-5 py-2 text-label-md text-error transition-colors hover:bg-error-container disabled:opacity-40"
          >
            {clearSlots.isPending ? "جارٍ المسح…" : "مسح المواعيد"}
          </button>
          {clearSlots.isSuccess && (
            <span className="ms-3 text-caption text-primary">تم المسح</span>
          )}
        </div>
      )}
    </div>
  );
}
