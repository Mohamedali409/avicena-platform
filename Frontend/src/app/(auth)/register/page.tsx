"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, homeFor } from "@/store/auth.store";
import { getErrorMessage } from "@/lib/api/errors";
import { registerSchema, step1Fields, type RegisterValues } from "@/features/auth/schemas";
import { resendVerificationRequest } from "@/features/auth/api";
import { updateProfile } from "@/features/patient/api";
import { AuthSidePanel } from "@/components/auth/AuthSidePanel";
import { Stepper } from "@/components/auth/Stepper";
import { PasswordInput } from "@/components/auth/PasswordInput";

const STEPS = ["الحساب", "البيانات", "التحقق"];

export default function RegisterPage() {
  const router = useRouter();
  const { register: createAccount, verifyEmail, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [cooldown, setCooldown] = useState(0);
  const [apiError, setApiError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { register, trigger, getValues, formState: { errors } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { nationality: "مصر", gender: "", phone: "", nationalId: "" },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // step 0 → 1
  const toProfile = async () => {
    if (await trigger([...step1Fields])) { setApiError(""); setStep(1); }
  };

  // step 1 → 2 : create the account (backend sends the OTP) then show verification
  const createAndVerify = async () => {
    setApiError("");
    if (!(await trigger(["phone", "nationalId"]))) return; // validate optional formats
    const v = getValues();
    try {
      await createAccount(v.name.trim(), v.email.trim(), v.password);
      sessionStorage.setItem("avicena.pendingProfile", JSON.stringify({
        phone: v.phone, gender: v.gender, dob: v.dob, nationality: v.nationality,
        nationalId: v.nationalId, address: { line1: v.addressLine1, line2: v.addressLine2 },
      }));
      setStep(2);
      setCooldown(60);
    } catch (err) {
      setApiError(getErrorMessage(err, "تعذّر إنشاء الحساب"));
    }
  };

  // step 2 : verify OTP → apply profile → dashboard
  const setDigit = (i: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) { setDigits((d) => d.map((x, idx) => (idx === i ? "" : x))); return; }
    setDigits((d) => { const n = [...d]; clean.split("").forEach((ch, k) => { if (i + k < 6) n[i + k] = ch; }); return n; });
    otpRefs.current[Math.min(i + clean.length, 5)]?.focus();
  };
  const onOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };
  const verify = async () => {
    setApiError("");
    const otp = digits.join("");
    if (otp.length !== 6) return setApiError("أدخل الرمز المكوّن من 6 أرقام");
    try {
      const s = await verifyEmail(getValues("email").trim(), otp);
      try {
        const p = sessionStorage.getItem("avicena.pendingProfile");
        if (p) { await updateProfile(JSON.parse(p)); sessionStorage.removeItem("avicena.pendingProfile"); }
      } catch { /* profile optional */ }
      router.replace(homeFor(s.role));
    } catch (err) {
      setApiError(getErrorMessage(err, "رمز غير صحيح أو منتهي"));
    }
  };
  const resend = async () => {
    if (cooldown > 0) return;
    setApiError("");
    try { await resendVerificationRequest(getValues("email").trim()); setCooldown(60); }
    catch (err) { setApiError(getErrorMessage(err, "تعذّر إعادة الإرسال")); }
  };

  const inputCls = (err?: unknown) =>
    `w-full rounded-xl border bg-surface-container-low/40 px-4 py-3.5 text-[15px] outline-none transition-all placeholder:text-outline focus:border-primary-container focus:bg-white focus:ring-4 focus:ring-primary-container/10 ${err ? "border-error" : "border-outline-variant/70"}`;
  const label = "mb-1.5 block text-sm font-semibold text-on-surface";
  const Err = ({ m }: { m?: string }) => (m ? <p className="mt-1 text-xs font-medium text-error">{m}</p> : null);
  const primaryBtn =
    "flex items-center justify-center gap-2 rounded-xl bg-primary-container py-3.5 text-[15px] font-bold text-white shadow-lg shadow-primary-container/25 transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50";

  return (
    <main className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-center text-[32px] font-extrabold tracking-tight text-on-surface">إنشاء حساب</h1>
          <p className="mb-8 text-center text-sm text-on-surface-variant">الخطوة {step + 1} من {STEPS.length} — {["بيانات الحساب", "البيانات الشخصية", "تأكيد البريد"][step]}</p>

          <Stepper steps={STEPS} current={step} />

          {apiError && <p className="mb-4 rounded-xl bg-error-container p-3 text-center text-sm text-on-error-container">{apiError}</p>}

          {/* STEP 1 — account */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className={label}>الاسم الكامل</label>
                <input className={inputCls(errors.name)} placeholder="مثال: أحمد محمد" {...register("name")} />
                <Err m={errors.name?.message} />
              </div>
              <div>
                <label className={label}>البريد الإلكتروني</label>
                <input className={inputCls(errors.email)} type="email" dir="ltr" placeholder="you@example.com" {...register("email")} />
                <Err m={errors.email?.message} />
              </div>
              <div>
                <label className={label}>كلمة المرور</label>
                <PasswordInput field={register("password")} error={!!errors.password} placeholder="8 أحرف على الأقل" />
                <Err m={errors.password?.message} />
              </div>
              <div>
                <label className={label}>تأكيد كلمة المرور</label>
                <PasswordInput field={register("confirm")} error={!!errors.confirm} />
                <Err m={errors.confirm?.message} />
              </div>
              <button type="button" onClick={toProfile} className={`w-full ${primaryBtn}`}>
                متابعة <span className="material-symbols-outlined">arrow_back</span>
              </button>
            </div>
          )}

          {/* STEP 2 — profile */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>رقم الهاتف</label>
                  <input className={inputCls(errors.phone)} dir="ltr" placeholder="01xxxxxxxxx" {...register("phone")} />
                  <Err m={errors.phone?.message} />
                </div>
                <div>
                  <label className={label}>تاريخ الميلاد</label>
                  <input className={inputCls(errors.dob)} type="date" {...register("dob")} />
                </div>
                <div>
                  <label className={label}>النوع</label>
                  <select className={inputCls(errors.gender)} {...register("gender")}>
                    <option value="">اختر</option>
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>
                <div>
                  <label className={label}>الجنسية</label>
                  <input className={inputCls(errors.nationality)} {...register("nationality")} />
                </div>
                <div className="col-span-2">
                  <label className={label}>الرقم القومي</label>
                  <input className={inputCls(errors.nationalId)} dir="ltr" placeholder="14 رقم" {...register("nationalId")} />
                  <Err m={errors.nationalId?.message} />
                </div>
                <div>
                  <label className={label}>المدينة</label>
                  <input className={inputCls(errors.addressLine1)} placeholder="القاهرة" {...register("addressLine1")} />
                </div>
                <div>
                  <label className={label}>الحي / الشارع</label>
                  <input className={inputCls(errors.addressLine2)} placeholder="مدينة نصر" {...register("addressLine2")} />
                </div>
              </div>
              <p className="text-center text-xs text-on-surface-variant">بياناتك الشخصية اختيارية — يمكنك تعديلها لاحقاً.</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(0)} className="flex items-center gap-1 rounded-xl bg-surface-container-low px-5 py-3.5 text-[15px] font-bold text-on-surface transition-all hover:bg-surface-container active:scale-[0.98]">
                  <span className="material-symbols-outlined">arrow_forward</span> رجوع
                </button>
                <button type="button" onClick={createAndVerify} disabled={loading} className={`flex-1 ${primaryBtn}`}>
                  {loading ? "جارٍ الإنشاء..." : "إرسال رمز التحقق"}
                  {!loading && <span className="material-symbols-outlined">send</span>}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — OTP verification */}
          {step === 2 && (
            <div className="space-y-6">
              <p className="text-center text-sm text-on-surface-variant">
                أدخل الرمز المرسل إلى <span className="font-semibold text-primary-container" dir="ltr">{getValues("email")}</span>
              </p>
              <div className="flex justify-center gap-2" dir="ltr">
                {digits.map((d, i) => (
                  <input key={i} ref={(el) => { otpRefs.current[i] = el; }} value={d}
                    onChange={(e) => setDigit(i, e.target.value)} onKeyDown={(e) => onOtpKey(i, e)}
                    inputMode="numeric" maxLength={6}
                    className="h-14 w-12 rounded-xl border border-outline-variant/70 bg-surface-container-low/40 text-center text-2xl font-bold outline-none transition-all focus:border-primary-container focus:bg-white focus:ring-4 focus:ring-primary-container/10" />
                ))}
              </div>
              <div className="text-center text-sm text-on-surface-variant">
                {cooldown > 0
                  ? <>إعادة الإرسال بعد <span className="font-bold text-primary-container">{cooldown}s</span></>
                  : <button type="button" onClick={resend} className="font-semibold text-primary-container hover:underline">إعادة إرسال الرمز</button>}
              </div>
              <button type="button" onClick={verify} disabled={loading} className={`w-full ${primaryBtn}`}>
                {loading ? "جارٍ التأكيد..." : "تأكيد وإنشاء الحساب"}
                {!loading && <span className="material-symbols-outlined">check_circle</span>}
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-bold text-primary-container hover:underline">تسجيل الدخول</Link>
          </p>
        </div>
      </div>

      <AuthSidePanel />
    </main>
  );
}
