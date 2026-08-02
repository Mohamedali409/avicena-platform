"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPharmacyProfile, updatePharmacyProfile } from "@/features/pharmacy/api";

export default function PharmacyProfilePage() {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["pharmacy-profile"],
    queryFn: getPharmacyProfile,
  });

  const [form, setForm] = useState({
    pharmacyName: "",
    phone: "",
    line1: "",
    city: "",
    deliveryAvailable: true,
    fee: 0,
    minOrder: 0,
    etaMinutes: 45,
  });
  const [image, setImage] = useState<File | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        pharmacyName: profile.pharmacyName ?? "",
        phone: profile.phone ?? "",
        line1: profile.address?.line1 ?? "",
        city: profile.address?.city ?? "",
        deliveryAvailable: profile.delivery?.available ?? true,
        fee: profile.delivery?.fee ?? 0,
        minOrder: profile.delivery?.minOrder ?? 0,
        etaMinutes: profile.delivery?.etaMinutes ?? 45,
      });
    }
  }, [profile]);

  const mut = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("pharmacyName", form.pharmacyName);
      fd.append("phone", form.phone);
      fd.append("address", JSON.stringify({ line1: form.line1, city: form.city }));
      fd.append(
        "delivery",
        JSON.stringify({
          available: form.deliveryAvailable,
          fee: Number(form.fee),
          minOrder: Number(form.minOrder),
          etaMinutes: Number(form.etaMinutes),
        }),
      );
      if (image) fd.append("image", image);
      return updatePharmacyProfile(fd);
    },
    onSuccess: () => {
      setSaved(true);
      setImage(null);
      qc.invalidateQueries({ queryKey: ["pharmacy-profile"] });
      setTimeout(() => setSaved(false), 2500);
    },
  });

  if (isLoading) return <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>;

  const field =
    "w-full rounded-lg border border-outline-variant px-3 py-2.5 outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-on-surface">ملف الصيدلية</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mut.mutate();
        }}
        className="space-y-5 rounded-xl border border-outline-variant/40 bg-white p-5 shadow-card"
      >
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image ? URL.createObjectURL(image) : profile?.image || "/avatar-placeholder.png"}
            alt=""
            className="h-16 w-16 rounded-full border border-outline-variant object-cover"
            onError={(e) => (e.currentTarget.style.visibility = "hidden")}
          />
          <label className="cursor-pointer rounded-lg border border-outline-variant px-3 py-2 text-label-md text-primary hover:bg-surface-container-low">
            تغيير الصورة
            <input type="file" accept="image/*" hidden onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-caption text-on-surface-variant">اسم الصيدلية</span>
            <input className={field} value={form.pharmacyName} onChange={(e) => setForm({ ...form, pharmacyName: e.target.value })} required />
          </label>
          <label className="space-y-1">
            <span className="text-caption text-on-surface-variant">الهاتف</span>
            <input className={field} dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-caption text-on-surface-variant">العنوان</span>
            <input className={field} value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-caption text-on-surface-variant">المدينة</span>
            <input className={field} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </label>
        </div>

        <div className="rounded-lg bg-surface-container-low p-4">
          <label className="mb-3 flex items-center gap-2 text-label-md text-on-surface">
            <input type="checkbox" checked={form.deliveryAvailable} onChange={(e) => setForm({ ...form, deliveryAvailable: e.target.checked })} />
            التوصيل متاح
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-1">
              <span className="text-caption text-on-surface-variant">رسوم التوصيل</span>
              <input className={field} type="number" min={0} value={form.fee} onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })} />
            </label>
            <label className="space-y-1">
              <span className="text-caption text-on-surface-variant">الحد الأدنى للطلب</span>
              <input className={field} type="number" min={0} value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} />
            </label>
            <label className="space-y-1">
              <span className="text-caption text-on-surface-variant">مدة التوصيل (دقيقة)</span>
              <input className={field} type="number" min={0} value={form.etaMinutes} onChange={(e) => setForm({ ...form, etaMinutes: Number(e.target.value) })} />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={mut.isPending}
            className="rounded-lg bg-primary-container px-6 py-2.5 text-white transition-all hover:opacity-90 disabled:opacity-50">
            {mut.isPending ? "جارٍ الحفظ…" : "حفظ التغييرات"}
          </button>
          {saved && <span className="text-caption text-primary">✅ تم الحفظ</span>}
          {mut.isError && <span className="text-caption text-error">تعذّر الحفظ</span>}
        </div>
      </form>
    </div>
  );
}
