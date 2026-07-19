"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordRequest, resendResetPasswordRequest, resetPasswordRequest } from "@/features/auth/api";
import { getErrorMessage } from "@/lib/api/errors";
import { resetFlowSchema, type ResetFlowValues } from "@/features/auth/schemas";
import { Stepper } from "@/components/auth/Stepper";
import { PasswordInput } from "@/components/auth/PasswordInput";

type Step = "email" | "otp" | "password";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const otp = digits.join("");

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ResetFlowValues>({ resolver: zodResolver(resetFlowSchema), mode: "onTouched" });

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // ── Step 1: email → send OTP
  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!(await trigger("email"))) return;
    setBusy(true);
    try {
      await forgotPasswordRequest(getValues("email").trim());
      setStep("otp");
      setCooldown(60);
    } catch (err) {
      setApiError(getErrorMessage(err, "تعذّر إرسال الرمز"));
    } finally {
      setBusy(false);
    }
  };

  // ── Step 2: OTP
  const setDigit = (i: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) { setDigits((d) => d.map((x, idx) => (idx === i ? "" : x))); return; }
    setDigits((d) => { const n = [...d]; clean.split("").forEach((ch, k) => { if (i + k < 6) n[i + k] = ch; }); return n; });
    inputs.current[Math.min(i + clean.length, 5)]?.focus();
  };
  const onOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };
  const confirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (otp.length !== 6) return setApiError("أدخل الرمز المكوّن من 6 أرقام");
    setStep("password");
  };
  const resend = async () => {
    if (cooldown > 0) return;
    setApiError("");
    try { await resendResetPasswordRequest(getValues("email").trim()); setCooldown(60); }
    catch (err) { setApiError(getErrorMessage(err, "تعذّر إعادة الإرسال")); }
  };

  // ── Step 3: new password
  const doReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!(await trigger(["password", "confirm"]))) return;
    setBusy(true);
    try {
      await resetPasswordRequest(getValues("email").trim(), otp, getValues("password"));
      router.replace("/login");
    } catch (err) {
      setApiError(getErrorMessage(err, "الرمز غير صحيح أو منتهي"));
      setStep("otp");
    } finally {
      setBusy(false);
    }
  };

  const field = (err?: unknown, pad = "pr-12 pl-4") =>
    `w-full rounded-xl border bg-surface-container-low/40 py-3.5 text-[15px] outline-none transition-all placeholder:text-outline focus:border-primary-container focus:bg-white focus:ring-4 focus:ring-primary-container/10 ${pad} ${err ? "border-error" : "border-outline-variant/70"}`;
  const iconCls =
    "material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary-container";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-br from-surface-container-low via-background to-surface-container-high opacity-80" />

      <div className="relative z-10 w-full max-w-[440px] rounded-xl border border-outline-variant/30 bg-white p-8 shadow-card md:p-10">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container text-white shadow-lg shadow-primary-container/30">
            <span className="material-symbols-outlined text-[34px]">
              {step === "email" ? "lock_reset" : step === "otp" ? "mark_email_read" : "password"}
            </span>
          </div>
          <h1 className="mb-1 text-2xl font-semibold text-on-surface">
            {step === "email" ? "استعادة كلمة المرور" : step === "otp" ? "أدخل رمز التحقق" : "كلمة مرور جديدة"}
          </h1>
          <p className="text-sm text-on-surface-variant">
            {step === "email" && "أدخل بريدك وسنرسل لك رمز إعادة التعيين"}
            {step === "otp" && <>الرمز أُرسل إلى <span className="font-medium text-primary-container" dir="ltr">{getValues("email")}</span></>}
            {step === "password" && "اختر كلمة مرور جديدة لحسابك"}
          </p>
        </div>

        {/* labeled steps */}
        <Stepper steps={["البريد", "رمز التحقق", "كلمة المرور"]} current={["email", "otp", "password"].indexOf(step)} />


        {apiError && <p className="mb-4 rounded-lg bg-error-container p-3 text-center text-sm text-on-error-container">{apiError}</p>}

        {step === "email" && (
          <form onSubmit={sendOtp} className="space-y-4" noValidate>
            <div className="group relative">
              <span className={iconCls}>mail</span>
              <input type="email" dir="ltr" placeholder="example@avicena.com" className={field(errors.email)} {...register("email")} />
            </div>
            {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
            <button type="submit" disabled={busy}
              className="w-full rounded-lg bg-primary-container py-3.5 font-semibold text-white shadow-lg shadow-primary-container/20 transition-all hover:bg-primary-container/90 active:scale-[0.98] disabled:opacity-50">
              {busy ? "جارٍ الإرسال..." : "إرسال الرمز"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={confirmOtp} className="space-y-5">
            <div className="flex justify-center gap-2" dir="ltr">
              {digits.map((d, i) => (
                <input key={i} ref={(el) => { inputs.current[i] = el; }} value={d}
                  onChange={(e) => setDigit(i, e.target.value)} onKeyDown={(e) => onOtpKey(i, e)}
                  inputMode="numeric" maxLength={6}
                  className="h-14 w-12 rounded-lg border border-outline-variant bg-surface-container-lowest text-center text-2xl font-bold outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" />
              ))}
            </div>
            <div className="text-center text-sm text-on-surface-variant">
              {cooldown > 0
                ? <>يمكنك إعادة الإرسال بعد <span className="font-bold text-primary-container">{cooldown}s</span></>
                : <button type="button" onClick={resend} className="font-medium text-primary-container hover:underline">إعادة إرسال الرمز</button>}
            </div>
            <button type="submit" className="w-full rounded-lg bg-primary-container py-3.5 font-semibold text-white shadow-lg shadow-primary-container/20 transition-all hover:bg-primary-container/90 active:scale-[0.98]">متابعة</button>
            <button type="button" onClick={() => { setStep("email"); setApiError(""); }} className="w-full text-center text-sm text-on-surface-variant hover:text-primary">تغيير البريد</button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={doReset} className="space-y-4" noValidate>
            <div>
              <PasswordInput field={register("password")} error={!!errors.password} placeholder="كلمة المرور الجديدة" />
              {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
            </div>
            <div>
              <PasswordInput field={register("confirm")} error={!!errors.confirm} placeholder="تأكيد كلمة المرور" />
              {errors.confirm && <p className="mt-1 text-xs text-error">{errors.confirm.message}</p>}
            </div>
            <button type="submit" disabled={busy}
              className="w-full rounded-lg bg-primary-container py-3.5 font-semibold text-white shadow-lg shadow-primary-container/20 transition-all hover:bg-primary-container/90 active:scale-[0.98] disabled:opacity-50">
              {busy ? "جارٍ الحفظ..." : "تعيين كلمة المرور"}
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
