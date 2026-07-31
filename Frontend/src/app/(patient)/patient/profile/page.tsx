"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "@/features/patient/api";
import type { ProfileInput } from "@/features/patient/api";

const FIELDS: { key: keyof ProfileInput; label: string; type?: string }[] = [
  { key: "name", label: "الاسم" },
  { key: "phone", label: "الهاتف" },
  { key: "gender", label: "النوع" },
  { key: "dob", label: "تاريخ الميلاد", type: "date" },
  { key: "nationality", label: "الجنسية" },
  { key: "nationalId", label: "الرقم القومي" },
];

export default function PatientProfilePage() {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const [form, setForm] = useState<ProfileInput>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        phone: profile.phone,
        gender: profile.gender,
        dob: profile.dob,
        nationality: profile.nationality,
        nationalId: profile.nationalId,
      });
    }
  }, [profile]);

  const save = useMutation({
    mutationFn: () => updateProfile(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const field =
    "w-full rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-headline-md text-on-surface">الملف الشخصي</h1>

      {isLoading && (
        <p className="text-caption text-on-surface-variant">جارٍ التحميل…</p>
      )}

      {profile && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
          className="space-y-5 rounded-xl bg-white p-6 shadow-card"
        >
          {/* Avatar + email */}
          <div className="flex items-center gap-4 border-b border-outline-variant pb-5">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary-container text-white">
              {profile.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[32px]">person</span>
              )}
            </div>
            <div>
              <p className="text-label-md text-on-surface">{profile.name ?? "—"}</p>
              <p className="text-caption text-on-surface-variant">{profile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label className="mb-1 block text-label-md text-on-surface-variant">
                  {f.label}
                </label>
                <input
                  type={f.type ?? "text"}
                  value={(form[f.key] as string) ?? ""}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, [f.key]: e.target.value }))
                  }
                  className={field}
                />
              </div>
            ))}
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
            {save.isError && (
              <span className="text-caption text-error">تعذّر الحفظ</span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
