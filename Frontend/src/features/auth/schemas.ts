import { z } from "zod";

// Shared field rules (Arabic messages), mirroring the backend validation.
const email = z.string().trim().min(1, "البريد الإلكتروني مطلوب").email("بريد إلكتروني غير صحيح");
const strongPassword = z
  .string()
  .min(8, "كلمة المرور 8 أحرف على الأقل")
  .regex(/[a-zA-Z]/, "لازم تحتوي على حرف")
  .regex(/[0-9]/, "لازم تحتوي على رقم");

// ── Login
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "أدخل كلمة المرور"),
});
export type LoginValues = z.infer<typeof loginSchema>;

// ── Register (2 steps in one form)
export const registerSchema = z
  .object({
    // step 1 — account
    name: z.string().trim().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
    email,
    password: strongPassword,
    confirm: z.string().min(1, "أعد إدخال كلمة المرور"),
    // step 2 — profile (optional, saved after verification)
    phone: z.string().trim().regex(/^0?\d{10,11}$/, "رقم هاتف غير صحيح").or(z.literal("")),
    gender: z.string().optional(),
    dob: z.string().optional(),
    nationality: z.string().optional(),
    nationalId: z.string().trim().regex(/^\d{14}$/, "الرقم القومي 14 رقماً").or(z.literal("")),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirm"],
  });
export type RegisterValues = z.infer<typeof registerSchema>;

// The exact field names validated in step 1 (used with RHF's trigger()).
export const step1Fields = ["name", "email", "password", "confirm"] as const;

// ── Forgot password (email step)
export const forgotEmailSchema = z.object({ email });
export type ForgotEmailValues = z.infer<typeof forgotEmailSchema>;

// ── Reset password flow (email + new password across steps; OTP handled manually)
export const resetFlowSchema = z
  .object({
    email,
    password: strongPassword,
    confirm: z.string().min(1, "أعد إدخال كلمة المرور"),
  })
  .refine((d) => d.password === d.confirm, { message: "كلمتا المرور غير متطابقتين", path: ["confirm"] });
export type ResetFlowValues = z.infer<typeof resetFlowSchema>;
