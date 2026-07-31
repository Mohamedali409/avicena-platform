"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLabProfile, updateLabProfile } from "@/features/labs/portal.api";

export default function LabProfilePage() {
  const qc = useQueryClient();
  const { data: lab, isLoading } = useQuery({
    queryKey: ["lab-profile"],
    queryFn: getLabProfile,
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    line1: "",
    line2: "",
    from: "",
    to: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (lab) {
      setForm({
        name: lab.name ?? "",
        phone: lab.phone ?? "",
        city: lab.address?.city ?? "",
        line1: lab.address?.line1 ?? "",
        line2: lab.address?.line2 ?? "",
        from: lab.workingHours?.from ?? "",
        to: lab.workingHours?.to ?? "",
      });
    }
  }, [lab]);

  const save = useMutation({
    mutationFn: () =>
      updateLabProfile({
        name: form.name,
        phone: form.phone,
        address: { line1: form.line1, line2: form.line2, city: form.city },
        workingHours: { from: form.from, to: form.to },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lab-profile"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const field =
    "w-full rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-primary";
  const label = "mb-1 block text-label-md text-on-surface-variant";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-headline-md text-on-surface">ملف المعمل</h1>

      {isLoading && (
        <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
      )}

      {lab && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
          className="space-y-5 rounded-xl bg-white p-6 shadow-card"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-outline-variant pb-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-white">
                <span className="material-symbols-outlined text-[32px]">biotech</span>
              </div>
              <div>
                <p className="text-label-md text-on-surface">{lab.name}</p>
                <p className="text-caption text-on-surface-variant">{lab.email}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-caption ${
                lab.isVerified
                  ? "bg-primary-container text-white"
                  : "bg-error-container text-on-error-container"
              }`}
            >
              {lab.isVerified ? "موثّق" : "قيد المراجعة"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label}>اسم المعمل</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} className={field} />
            </div>
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
            <div>
              <label className={label}>ساعات العمل — من</label>
              <input type="time" value={form.from} onChange={(e) => set("from", e.target.value)} className={field} />
            </div>
            <div>
              <label className={label}>إلى</label>
              <input type="time" value={form.to} onChange={(e) => set("to", e.target.value)} className={field} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={save.isPending}
              className="rounded-xl bg-primary-container px-6 py-3 text-label-md text-white disabled:opacity-40"
            >
              {save.isPending ? "جارٍ الحفظ…" : "حفظ التغييرات"}
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

      {/* Tests summary (read-only) */}
      {lab && (
        <div className="rounded-xl bg-white p-6 shadow-card">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-label-md text-on-surface">التحاليل ({lab.tests?.length ?? 0})</h2>
            <Link href="/lab/tests" className="text-caption text-primary hover:underline">
              عرض الكل
            </Link>
          </div>
          <p className="text-caption text-on-surface-variant">
            قائمة التحاليل تُدار عبر إدارة المنصة حاليًا.
          </p>
        </div>
      )}
    </div>
  );
}
