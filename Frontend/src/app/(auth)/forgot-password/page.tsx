"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forgotPasswordRequest } from "@/features/auth/api";
import { getErrorMessage } from "@/lib/api/errors";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("بريد إلكتروني غير صحيح");
    setLoading(true);
    try {
      await forgotPasswordRequest(email.trim());
      // Backend sends an OTP → move to the reset step (email prefilled).
      router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      setError(getErrorMessage(err, "تعذّر إرسال الرمز"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-br from-surface-container-low via-background to-surface-container-high opacity-80" />

      <div className="relative z-10 w-full max-w-[440px] rounded-xl border border-outline-variant/30 bg-white p-8 shadow-card md:p-10">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container text-white shadow-lg shadow-primary-container/30">
            <span className="material-symbols-outlined text-[34px]">lock_reset</span>
          </div>
          <h1 className="mb-1 text-2xl font-semibold text-on-surface">استعادة كلمة المرور</h1>
          <p className="text-sm text-on-surface-variant">أدخل بريدك وسنرسل لك رمز إعادة التعيين</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="group relative">
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary-container">mail</span>
            <input type="email" placeholder="example@avicena.com" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-3 pr-12 pl-4 outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" />
          </div>

          {error && <p className="rounded-lg bg-error-container p-3 text-sm text-on-error-container">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-primary-container py-3.5 font-semibold text-white shadow-lg shadow-primary-container/20 transition-all hover:bg-primary-container/90 active:scale-[0.98] disabled:opacity-50">
            {loading ? "جارٍ الإرسال..." : "إرسال رمز الاستعادة"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="text-on-surface-variant hover:text-primary">العودة لتسجيل الدخول</Link>
        </p>
      </div>
    </main>
  );
}
