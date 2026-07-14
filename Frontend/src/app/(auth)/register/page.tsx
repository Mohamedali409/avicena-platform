"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, homeFor } from "@/store/auth.store";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) return setError("كلمتا المرور غير متطابقتين");
    if (password.length < 8) return setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
    try {
      const s = await register(name, email, password);
      router.replace(homeFor(s.role));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "تعذّر إنشاء الحساب";
      setError(msg);
    }
  };

  const field =
    "w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-3 pr-12 pl-4 outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/20";
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

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface-variant">الاسم الكامل</label>
            <div className="group relative">
              <span className={icon}>person</span>
              <input className={field} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface-variant">البريد الإلكتروني</label>
            <div className="group relative">
              <span className={icon}>mail</span>
              <input className={field} type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface-variant">كلمة المرور</label>
            <div className="group relative">
              <span className={icon}>lock</span>
              <input className={field} type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface-variant">تأكيد كلمة المرور</label>
            <div className="group relative">
              <span className={icon}>lock_reset</span>
              <input className={field} type="password" dir="ltr" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
          </div>

          {error && <p className="rounded-lg bg-error-container p-3 text-sm text-on-error-container">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-4 text-lg font-semibold text-white shadow-lg shadow-primary-container/20 transition-all hover:bg-primary-container/90 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "جارٍ الإنشاء..." : "إنشاء حساب"}
          </button>
        </form>

        <div className="mt-8 border-t border-outline-variant/30 pt-8 text-center text-on-surface-variant">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="mr-1 font-bold text-primary-container hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </main>
  );
}
