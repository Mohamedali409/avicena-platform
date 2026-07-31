"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminDoctors,
  addAdminDoctor,
  removeAdminDoctor,
  toggleDoctorAvailability,
} from "@/features/admin/api";

const initial = {
  doctorName: "",
  email: "",
  password: "",
  specialization: "",
  degree: "",
  expertise: "",
  about: "",
  phone: "",
  city: "",
  fees: "",
  consultation_fees: "",
};

export default function AdminDoctorsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initial);
  const [image, setImage] = useState<File | null>(null);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: getAdminDoctors,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-doctors"] });
  const remove = useMutation({ mutationFn: removeAdminDoctor, onSuccess: invalidate });
  const toggle = useMutation({ mutationFn: toggleDoctorAvailability, onSuccess: invalidate });

  const add = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("doctorName", form.doctorName);
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("specialization", form.specialization);
      fd.append("degree", form.degree);
      fd.append("expertise", form.expertise);
      fd.append("about", form.about);
      fd.append("phone", form.phone);
      fd.append("fees", form.fees);
      fd.append("consultation_fees", form.consultation_fees);
      fd.append("address", JSON.stringify({ line1: "", line2: "", city: form.city }));
      fd.append("start_booked", JSON.stringify({ from: 9, to: 17, booking_period: 30 }));
      if (image) fd.append("image", image);
      return addAdminDoctor(fd);
    },
    onSuccess: () => {
      invalidate();
      setForm(initial);
      setImage(null);
      setShowForm(false);
    },
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.doctorName && form.email && form.password && form.specialization && form.fees;
  const field = "w-full rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-body-md outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">الأطباء ({doctors.length})</h1>
        <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-1 rounded-xl bg-primary-container px-4 py-2 text-label-md text-white">
          <span className="material-symbols-outlined text-[18px]">{showForm ? "close" : "add"}</span>
          {showForm ? "إغلاق" : "إضافة طبيب"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => { e.preventDefault(); if (valid) add.mutate(); }}
          className="grid grid-cols-1 gap-4 rounded-xl bg-white p-6 shadow-card sm:grid-cols-2"
        >
          <input placeholder="اسم الطبيب *" value={form.doctorName} onChange={(e) => set("doctorName", e.target.value)} className={field} />
          <input placeholder="التخصص *" value={form.specialization} onChange={(e) => set("specialization", e.target.value)} className={field} />
          <input placeholder="الإيميل *" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={field} />
          <input placeholder="كلمة المرور *" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} className={field} />
          <input placeholder="الدرجة العلمية" value={form.degree} onChange={(e) => set("degree", e.target.value)} className={field} />
          <input placeholder="سنوات الخبرة" value={form.expertise} onChange={(e) => set("expertise", e.target.value)} className={field} />
          <input placeholder="الهاتف" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={field} />
          <input placeholder="المدينة" value={form.city} onChange={(e) => set("city", e.target.value)} className={field} />
          <input placeholder="رسوم الكشف *" type="number" value={form.fees} onChange={(e) => set("fees", e.target.value)} className={field} />
          <input placeholder="رسوم الاستشارة" type="number" value={form.consultation_fees} onChange={(e) => set("consultation_fees", e.target.value)} className={field} />
          <textarea placeholder="نبذة" value={form.about} onChange={(e) => set("about", e.target.value)} className={`${field} sm:col-span-2`} rows={2} />
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className="text-caption text-on-surface-variant sm:col-span-2" />
          {add.isError && <p className="text-caption text-error sm:col-span-2">تعذّرت الإضافة، تأكّد من البيانات.</p>}
          <button type="submit" disabled={!valid || add.isPending} className="rounded-xl bg-primary-container py-3 text-label-md text-white disabled:opacity-40 sm:col-span-2">
            {add.isPending ? "جارٍ الإضافة…" : "إضافة الطبيب"}
          </button>
        </form>
      )}

      {isLoading && <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>}

      <ul className="space-y-2">
        {doctors.map((d) => (
          <li key={d._id} className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-primary">
                <span className="material-symbols-outlined">stethoscope</span>
              </div>
              <div>
                <p className="text-label-md text-on-surface">د. {d.doctorName}</p>
                <p className="text-caption text-on-surface-variant">{d.specialization} {d.fees ? `· ${d.fees} ج.م` : ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggle.mutate(d._id)} disabled={toggle.isPending} className={`rounded-lg px-3 py-1.5 text-caption transition-colors disabled:opacity-40 ${d.available === false ? "bg-surface-container-high text-on-surface-variant" : "bg-green-100 text-green-700"}`}>
                {d.available === false ? "غير متاح" : "متاح"}
              </button>
              <button onClick={() => remove.mutate(d._id)} disabled={remove.isPending} className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-error-container hover:text-error disabled:opacity-40" aria-label="حذف">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
      {!isLoading && doctors.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center shadow-card">
          <p className="text-body-md text-on-surface-variant">لا يوجد أطباء.</p>
        </div>
      )}
    </div>
  );
}
