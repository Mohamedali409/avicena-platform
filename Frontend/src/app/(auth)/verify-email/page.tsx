"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, homeFor } from "@/store/auth.store";
import { resendVerificationRequest } from "@/features/auth/api";
import { updateProfile } from "@/features/patient/api";
import { getErrorMessage } from "@/lib/api/errors";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}

function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const { verifyEmail, loading } = useAuth();

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const setDigit = (i: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) { setDigits((d) => d.map((x, idx) => (idx === i ? "" : x))); return; }
    setDigits((d) => {
      const next = [...d];
      clean.split("").forEach((ch, k) => { if (i + k < 6) next[i + k] = ch; });
      return next;
    });
    const nextIdx = Math.min(i + clean.length, 5);
    inputs.current[nextIdx]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    const otp = digits.join("");
    if (otp.length !== 6) return setError("أدخل الرمز المكوّن من 6 أرقام");
    try {
      const s = await verifyEmail(email, otp);
      // Apply the profile collected during registration (now that we have a token).
      try {
        const pending = sessionStorage.getItem("avicena.pendingProfile");
        if (pending) {
          await updateProfile(JSON.parse(pending));
          sessionStorage.removeItem("avicena.pendingProfile");
        }
      } catch { /* profile is optional — ignore failures */ }
      router.replace(homeFor(s.role));
    } catch (err) {
      setError(getErrorMessage(err, "رمز غير صحيح أو منتهي"));
    }
  };

  const resend = async () => {
    if (cooldown > 0) return;
    setError(""); setResendMsg("");
    try {
      await resendVerificationRequest(email);
      setResendMsg("تم إرسال رمز جديد إلى بريدك.");
      setCooldown(60);
    } catch (err) {
      setError(getErrorMessage(err, "تعذّر إعادة الإرسال"));
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-br from-surface-container-low via-background to-surface-container-high opacity-80" />

      <div className="relative z-10 w-full max-w-[480px] rounded-xl border border-outline-variant/30 bg-white p-8 shadow-card md:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container text-white shadow-lg shadow-primary-container/30">
            <span className="material-symbols-outlined text-[34px]">mark_email_read</span>
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-on-surface">تأكيد البريد الإلكتروني</h1>
          <p className="text-on-surface-variant">
            أدخل الرمز المرسل إلى{" "}
            <span className="font-medium text-primary-container" dir="ltr">{email || "بريدك"}</span>
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="flex justify-center gap-2" dir="ltr">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                inputMode="numeric"
                maxLength={6}
                className="h-14 w-12 rounded-lg border border-outline-variant bg-surface-container-lowest text-center text-2xl font-bold outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
              />
            ))}
          </div>

          {error && <p className="rounded-lg bg-error-container p-3 text-center text-sm text-on-error-container">{error}</p>}
          {resendMsg && <p className="rounded-lg bg-primary-container/10 p-3 text-center text-sm text-primary">{resendMsg}</p>}

          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-3.5 text-lg font-semibold text-white shadow-lg shadow-primary-container/20 transition-all hover:bg-primary-container/90 active:scale-[0.98] disabled:opacity-50">
            {loading ? "جارٍ التأكيد..." : "تأكيد"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-on-surface-variant">
          لم يصلك الرمز؟{" "}
          <button onClick={resend} disabled={cooldown > 0}
            className="font-medium text-primary-container hover:underline disabled:text-outline disabled:no-underline">
            {cooldown > 0 ? `إعادة الإرسال بعد ${cooldown}s` : "إعادة الإرسال"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-on-surface-variant hover:text-primary">العودة لتسجيل الدخول</Link>
        </div>
      </div>
    </main>
  );
}
