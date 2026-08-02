"use client";

import { useState } from "react";
import { submitApplication } from "@/features/pharmacy/api";

export default function PharmaciesPage() {
  const [form, setForm] = useState({
    pharmacyName: "",
    ownerName: "",
    email: "",
    phone: "",
    line1: "",
    city: "",
    licenseNumber: "",
    description: "",
  });
  const [documents, setDocuments] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form, v: string) => setForm({ ...form, [k]: v });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("pharmacyName", form.pharmacyName);
      fd.append("ownerName", form.ownerName);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("licenseNumber", form.licenseNumber);
      fd.append("description", form.description);
      fd.append("address", JSON.stringify({ line1: form.line1, city: form.city }));
      if (documents) fd.append("documents", documents);
      await submitApplication(fd);
      setDone(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "تعذّر إرسال الطلب");
    } finally {
      setBusy(false);
    }
  };

  const field = "w-full rounded-lg border border-outline-variant px-3 py-2.5 outline-none focus:border-primary";

  if (done) {
    return (
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/10 text-primary-container">
          <span className="material-symbols-outlined text-[36px]">check_circle</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface">تم استلام طلبك</h1>
        <p className="mt-2 text-on-surface-variant">
          سيراجع فريقنا طلب تسجيل صيدليتك. عند الموافقة ستصلك بيانات الدخول على بريدك.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-white">
          <span className="material-symbols-outlined text-[30px]">local_pharmacy</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface">سجّل صيدليتك في ابن سينا</h1>
        <p className="text-on-surface-variant">اعرض منتجاتك واستقبل الطلبات من آلاف المرضى</p>
      </div>

      <form onSubmit={submit} className="grid gap-4 rounded-xl border border-outline-variant/40 bg-white p-6 shadow-card sm:grid-cols-2">
        <input required className={field} placeholder="اسم الصيدلية" value={form.pharmacyName} onChange={(e) => set("pharmacyName", e.target.value)} />
        <input required className={field} placeholder="اسم المالك" value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
        <input required type="email" dir="ltr" className={field} placeholder="البريد الإلكتروني" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <input required dir="ltr" className={field} placeholder="رقم الهاتف" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <input required className={field} placeholder="العنوان" value={form.line1} onChange={(e) => set("line1", e.target.value)} />
        <input required className={field} placeholder="المدينة" value={form.city} onChange={(e) => set("city", e.target.value)} />
        <input required className={`${field} sm:col-span-2`} placeholder="رقم الترخيص" value={form.licenseNumber} onChange={(e) => set("licenseNumber", e.target.value)} />
        <textarea className={`${field} sm:col-span-2`} placeholder="نبذة عن الصيدلية (اختياري)" value={form.description} onChange={(e) => set("description", e.target.value)} />

        <label className="sm:col-span-2">
          <span className="mb-1 block text-caption text-on-surface-variant">مستند الترخيص (اختياري)</span>
          <input type="file" accept="image/*,.pdf" onChange={(e) => setDocuments(e.target.files?.[0] ?? null)}
            className="block w-full text-body-md file:mr-3 file:rounded-lg file:border-0 file:bg-primary-container file:px-4 file:py-2 file:text-white" />
        </label>

        {error && <p className="sm:col-span-2 rounded-lg bg-error-container p-2 text-caption text-on-error-container">{error}</p>}

        <button type="submit" disabled={busy}
          className="sm:col-span-2 rounded-lg bg-primary-container py-3 text-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50">
          {busy ? "جارٍ الإرسال…" : "إرسال الطلب"}
        </button>
      </form>
    </main>
  );
}
