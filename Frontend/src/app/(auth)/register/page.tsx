"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth.store";
import { getErrorMessage } from "@/lib/api/errors";

// Client-side validation mirroring the backend rules.
function validate(name: string, email: string, password: string, confirm: string) {
  const errors: Record<string, string> = {};
  if (name.trim().length < 3) errors.name = "الاسم يجب أن يكون 3 أحرف على الأقل";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "بريد إلكتروني غير صحيح";
  if (password.length < 8) errors.password = "كلمة المرور 8 أحرف على الأقل";
  else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) errors.password = "لازم تحتوي على حرف ورقم";
  if (confirm !== password) errors.confirm = "كلمتا المرور غير متطابقتين";
  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    const errs = validate(name, email, password, confirm);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      const { email: registered } = await register(name.trim(), email.trim(), password);
      // No token yet — the account must verify its email first.
      router.push(`/verify-email?email=${encodeURIComponent(registered)}`);
    } catch (err) {
      setApiError(getErrorMessage(err, "تعذّر إنشاء الحساب"));
    }
  };

  const field =
    "w-full rounded-lg border bg-surface-container-lowest py-3 pr-12 pl-4 outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/20";
  const icon =
    "material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary-container";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-br from-surface-container-low via-background to-surface-container-high opacity-80" />

      <div className="relative z-10 w-full max-w-[480px] rounded-xl border border-outline-variant/30 bg-white p-8 shadow-card md:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container text-white shadow-lg shadow-primary-container/30">
            <span className="material-symbols-outlined text-[34px]">person_add</span>
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-on-surface">إنشاء حساب في ابن سينا</h1>
          <p className="text-on-surface-variant">ابدأ رحلتك الصحية معنا</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-on-surface-variant">الاسم الكامل</label>
            <div className="group relative">
              <span className={icon}>person</span>
              <input className={`${field} ${errors.name ? "border-error" : "border-outline-variant"}`} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {errors.name && <p className="text-xs text-error">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-on-surface-variant">البريد الإلكتروني</label>
            <div className="group relative">
              <span className={icon}>mail</span>
              <input className={`${field} ${errors.email ? "border-error" : "border-outline-variant"}`} type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {errors.email && <p className="text-xs text-error">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-on-surface-variant">كلمة المرور</label>
            <div className="group relative">
              <span className={icon}>lock</span>
              <input className={`${field} ${errors.password ? "border-error" : "border-outline-variant"}`} type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {errors.password && <p className="text-xs text-error">{errors.password}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-on-surface-variant">تأكيد كلمة المرور</label>
            <div className="group relative">
              <span className={icon}>lock_reset</span>
              <input className={`${field} ${errors.confirm ? "border-error" : "border-outline-variant"}`} type="password" dir="ltr" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            {errors.confirm && <p className="text-xs text-error">{errors.confirm}</p>}
          </div>

          {apiError && <p className="rounded-lg bg-error-container p-3 text-sm text-on-error-container">{apiError}</p>}

          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-3.5 text-lg font-semibold text-white shadow-lg shadow-primary-container/20 transition-all hover:bg-primary-container/90 active:scale-[0.98] disabled:opacity-50">
            {loading ? "جارٍ الإنشاء..." : "إنشاء حساب"}
          </button>
        </form>

        <div className="mt-8 border-t border-outline-variant/30 pt-8 text-center text-on-surface-variant">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="mr-1 font-bold text-primary-container hover:underline">تسجيل الدخول</Link>
        </div>
      </div>
    </main>
  );
}
