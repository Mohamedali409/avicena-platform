"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordRequest, resendResetPasswordRequest } from "@/features/auth/api";
import { getErrorMessage } from "@/lib/api/errors";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("بريد إلكتروني غير صحيح");
    if (otp.length !== 6) return setError("الرمز مكوّن من 6 أرقام");
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
      return setError("كلمة المرور 8 أحرف على الأقل وتحتوي حرف ورقم");
    if (password !== confirm) return setError("كلمتا المرور غير متطابقتين");

    setLoading(true);
    try {
      await resetPasswordRequest(email.trim(), otp, password);
      setOk(true);
      setTimeout(() => router.replace("/login"), 1500);
    } catch (err) {
      setError(getErrorMessage(err, "تعذّر إعادة التعيين"));
    } finally {
      setLoading(false);
    }
  };

  const field =
    "w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-3 pr-12 pl-4 outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/20";
  const icon =
    "material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary-container";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-br from-surface-container-low via-background to-surface-container-high opacity-80" />

      <div className="relative z-10 w-full max-w-[440px] rounded-xl border border-outline-variant/30 bg-white p-8 shadow-card md:p-10">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container text-white shadow-lg shadow-primary-container/30">
            <span className="material-symbols-outlined text-[34px]">password</span>
          </div>
          <h1 className="mb-1 text-2xl font-semibold text-on-surface">تعيين كلمة مرور جديدة</h1>
          <p className="text-sm text-on-surface-variant">أدخل الرمز المرسل لبريدك وكلمة المرور الجديدة</p>
        </div>

        {ok ? (
          <div className="rounded-lg bg-primary-container/10 p-4 text-center text-sm text-primary">
            ✅ تم تغيير كلمة المرور. جارٍ تحويلك لتسجيل الدخول...
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="group relative">
              <span className={icon}>mail</span>
              <input className={field} type="email" dir="ltr" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="group relative">
              <span className={icon}>pin</span>
              <input className={`${field} tracking-[0.5em]`} dir="ltr" inputMode="numeric" maxLength={6} placeholder="رمز التحقق" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} />
            </div>
            <div className="group relative">
              <span className={icon}>lock</span>
              <input className={field} type="password" dir="ltr" placeholder="كلمة المرور الجديدة" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="group relative">
              <span className={icon}>lock_reset</span>
              <input className={field} type="password" dir="ltr" placeholder="تأكيد كلمة المرور" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>

            {error && <p className="rounded-lg bg-error-container p-3 text-sm text-on-error-container">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-primary-container py-3.5 font-semibold text-white shadow-lg shadow-primary-container/20 transition-all hover:bg-primary-container/90 active:scale-[0.98] disabled:opacity-50">
              {loading ? "جارٍ الحفظ..." : "تعيين كلمة المرور"}
            </button>

            <button type="button" onClick={() => resendResetPasswordRequest(email.trim()).catch(() => {})}
              className="w-full text-center text-sm text-primary-container hover:underline">
              إعادة إرسال الرمز
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="text-on-surface-variant hover:text-primary">العودة لتسجيل الدخول</Link>
        </p>
      </div>
    </main>
  );
}
