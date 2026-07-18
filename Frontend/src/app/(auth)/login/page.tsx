/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, homeFor } from "@/store/auth.store";
import { getErrorMessage, isUnverifiedError } from "@/lib/api/errors";

const SIDE_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC-pOb0lBdcsn_Bau-fj5g751-t8Qo12tPll_H5Fht7esqMg2xNYF82iv_n-G6MjriKZ39UKy_y2SFz4585Sn5-vQiW_b1RRYd8B8tdBuC2WjjdcM_j2MRL2FU3q5lFLdX5JeXUopTEWQ85AMHV7scBWploEHa4OofyZ3QnEPprP4x7MxiJPC3vaE66K2PTyKfTqIZo3cbPUF-QiYciLI7FCDQvE_drEjIMf2HHeykv1DA5zZSyUtnRO7Y8AlmdCGKm8sEVuyH8DNc";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const s = await login(email, password);
      router.replace(homeFor(s.role));
    } catch (err: unknown) {
      // Account exists but email not verified → send them to verify instead of dead-ending.
      if (isUnverifiedError(err)) {
        router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
        return;
      }
      setError(getErrorMessage(err, "تعذّر تسجيل الدخول، تأكد من البيانات"));
    }
  };

  return (
    <main className="flex min-h-screen">
      {/* Form side (right in RTL) */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Branding */}
          <Link href="/" className="mb-8 flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
            <span className="text-[24px] font-bold tracking-tight">Avicena</span>
          </Link>

          <h1 className="mb-2 text-headline-lg text-on-surface">مرحباً بعودتك 👋</h1>
          <p className="mb-8 text-body-md text-on-surface-variant">أدخل بياناتك للوصول إلى حسابك الطبي</p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-on-surface-variant" htmlFor="email">البريد الإلكتروني</label>
              <div className="group relative">
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary-container">mail</span>
                <input id="email" type="email" required dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@avicena.com"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-3 pr-12 pl-4 outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-on-surface-variant" htmlFor="password">كلمة المرور</label>
                <Link href="/forgot-password" className="text-xs text-primary-container hover:underline">نسيت كلمة المرور؟</Link>
              </div>
              <div className="group relative">
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary-container">lock</span>
                <input id="password" type={showPass ? "text" : "password"} required dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-3 pr-12 pl-12 outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" />
                <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface">
                  <span className="material-symbols-outlined">{showPass ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer select-none items-center gap-2 text-on-surface-variant">
              <input type="checkbox" className="h-5 w-5 rounded border-outline-variant text-primary-container focus:ring-primary-container" />
              تذكرني على هذا الجهاز
            </label>

            {error && <p className="rounded-lg bg-error-container p-3 text-sm text-on-error-container">{error}</p>}

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-3.5 text-lg font-semibold text-white shadow-lg shadow-primary-container/20 transition-all hover:bg-primary-container/90 active:scale-[0.98] disabled:opacity-50">
              <span>{loading ? "جارٍ الدخول..." : "دخول"}</span>
              {!loading && <span className="material-symbols-outlined">login</span>}
            </button>

            <button type="button" onClick={() => setError("تسجيل الدخول عبر جوجل غير مفعّل حالياً")}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-outline-variant bg-white py-3.5 text-lg font-semibold text-on-surface transition-all hover:bg-surface-container-low active:scale-[0.98]">
              <svg className="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>تسجيل الدخول عبر جوجل</span>
            </button>
          </form>

          <p className="mt-8 text-center text-body-md text-on-surface-variant">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="font-bold text-primary-container hover:underline">إنشاء حساب</Link>
          </p>
        </div>
      </div>

      {/* Image side (left in RTL) */}
      <div className="relative hidden w-1/2 lg:block">
        <img src={SIDE_IMG} alt="رعاية صحية" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary-container/70 to-primary-container/30" />
        <div className="relative z-10 flex h-full flex-col justify-end p-12 text-white">
          <h2 className="mb-4 text-4xl font-bold leading-tight">رعايتك الصحية<br />في متناول يدك</h2>
          <p className="mb-8 max-w-md text-lg text-white/90">احجز، استشر، وتابع تقاريرك الطبية مع نخبة الأطباء والمعامل — في أي وقت ومن أي مكان.</p>
          <ul className="space-y-3">
            {[["bolt", "حجز فوري خلال دقائق"], ["videocam", "استشارات بالفيديو عالية الجودة"], ["shield", "بياناتك الطبية آمنة ومشفّرة"]].map(([icon, text]) => (
              <li key={text} className="flex items-center gap-3 text-white/95">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20"><span className="material-symbols-outlined text-[20px]">{icon}</span></span>
                <span className="text-body-md">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
