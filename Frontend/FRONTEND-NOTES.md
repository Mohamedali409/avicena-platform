# 📋 شرح شغل الفرونت اند — للمناقشة

ملخّص اللي اتعمل في الفرونت (Next.js) مع **التقنية المستخدمة ومكانها في الكود** — للفاليديشن، توجيه كل مستخدم لداشبورده، والصفحات.

---

## 1) التقنيات المستخدمة (Stack)

| الغرض | التقنية |
|------|---------|
| الإطار | **Next.js (App Router)** + TypeScript |
| الحالة (State) | **Zustand** (لإدارة الجلسة) |
| الفورمات والفاليديشن | **react-hook-form** + **zod** (schema validation) |
| طلبات الـ API | **Axios** (instance واحد + interceptor) |
| التصميم | **Tailwind CSS** + خط **Cairo** + هوية "Clinical Clarity" (تركوازي #0e7490) |
| RTL | عربي بشكل افتراضي |

---

## 2) الفاليديشن (Validation) — react-hook-form + zod

**الفكرة:** القواعد كلها في **schema واحد** بـ zod، و`react-hook-form` بيدير الفورم والأخطاء.

| العنصر | المكان في الكود |
|--------|----------------|
| **الـ Schemas** (كل قواعد التحقق) | [`src/features/auth/schemas.ts`](src/features/auth/schemas.ts) |
| ربط zod بـ RHF | `zodResolver` في كل صفحة (`useForm({ resolver: zodResolver(schema), mode: "onTouched" })`) |
| فاليديشن **live** (وانت بتكتب) | خاصية `mode: "onTouched"` — الأخطاء تظهر بعد لمس الحقل وتتحدّث مع كل حرف |
| عرض الأخطاء تحت كل حقل | `errors.<field>.message` في الـ JSX |

**أمثلة القواعد (في schemas.ts):**
- الإيميل: `z.string().email()`
- كلمة المرور: 8 أحرف + حرف + رقم (regex)
- تطابق كلمتي المرور: `.refine(d => d.password === d.confirm)`
- الرقم القومي: 14 رقم

**الصفحات اللي بتستخدمه:** login · register · forgot/reset password.

---

## 3) تدفّق المصادقة والكوكيز (Auth + Cookies)

الباك اند بيخزّن التوكن في **httpOnly cookies** (مش localStorage) — أكثر أماناً ضد XSS.

| العنصر | المكان |
|--------|--------|
| Axios instance + **`withCredentials: true`** (يبعت الكوكيز تلقائياً) + **refresh عند 401** | [`src/lib/api/client.ts`](src/lib/api/client.ts) |
| تخزين الجلسة (**role + user فقط**، بدون توكن) | [`src/lib/auth/session.ts`](src/lib/auth/session.ts) |
| إدارة الدخول/الخروج/التحقق (Zustand) | [`src/store/auth.store.ts`](src/store/auth.store.ts) |
| استدعاءات الـ API للـ auth | [`src/features/auth/api.ts`](src/features/auth/api.ts) |

**آلية الكوكيز:** `accessToken` (15 دقيقة) + `refreshToken` (7 أيام) — بيتبعتوا تلقائياً مع كل طلب. لما الـ access يخلص → 401 → الفرونت يستدعي `/api/auth/refresh` ويعيد الطلب.

---

## 4) توجيه كل مستخدم لداشبورده (Role-based Routing)

**الفكرة:** الباك يرجّع `role` عند الدخول → نخزّنه → نوجّه المستخدم لداشبورد نوعه → نحمي الصفحات.

| العنصر | المكان | الوظيفة |
|--------|--------|---------|
| خريطة الأدوار → الصفحة الرئيسية لكل دور | [`src/config/roles.ts`](src/config/roles.ts) | `patient → /patient/dashboard` · `doctor → /doctor/dashboard` · `admin → /admin/dashboard` · `lab → /lab/profile` |
| `homeFor(role)` | [`src/store/auth.store.ts`](src/store/auth.store.ts) | يرجّع الصفحة الرئيسية للدور |
| التوجيه بعد الدخول | صفحة login | `router.replace(homeFor(session.role))` |
| **حماية صفحات كل دور** | [`src/components/shared/RoleGuard.tsx`](src/components/shared/RoleGuard.tsx) | لو الدور غلط أو مفيش جلسة → يرجّع للّوجين |
| **منع الداخلين من صفحات الـ auth** | [`src/components/shared/GuestGuard.tsx`](src/components/shared/GuestGuard.tsx) | لو داخل ودخل على /login → يوجّهه للداشبورد |
| تطبيق GuestGuard على كل صفحات الـ auth | [`src/app/(auth)/layout.tsx`](src/app/(auth)/layout.tsx) | — |

كل داشبورد دور في مجموعة route منفصلة: `(patient)` · `(doctor)` · `(admin)` · `(lab)` — كل واحدة `layout.tsx` بيلفّها بـ `RoleGuard`.

---

## 5) الصفحات اللي اتعملت / اتظبطت النهاردة

| الصفحة | المكان | المميزات |
|--------|--------|----------|
| **تسجيل الدخول** | [`src/app/(auth)/login/page.tsx`](src/app/(auth)/login/page.tsx) | RHF + zod · تصميم نصّين (فورم + بانل) · إظهار/إخفاء الباسورد · معالجة "الإيميل غير مفعّل" (403 → verify) |
| **إنشاء حساب (Wizard 3 خطوات)** | [`src/app/(auth)/register/page.tsx`](src/app/(auth)/register/page.tsx) | Stepper: الحساب → البيانات الشخصية → **التحقق (OTP)** · حفظ البيانات الشخصية بعد التفعيل |
| **تأكيد البريد (OTP)** | [`src/app/(auth)/verify-email/page.tsx`](src/app/(auth)/verify-email/page.tsx) | 6 خانات OTP + عدّاد إعادة إرسال |
| **نسيت/إعادة تعيين الباسورد (3 خطوات)** | [`src/app/(auth)/forgot-password/page.tsx`](src/app/(auth)/forgot-password/page.tsx) | Stepper: البريد → OTP → كلمة مرور جديدة |
| **الرئيسية (مودرن)** | [`src/app/page.tsx`](src/app/page.tsx) | Hero + إحصائيات + تخصصات + أطباء + معامل + CTA — نسخة ديسكتوب وموبايل |

---

## 6) المكوّنات المشتركة (Reusable Components)

| المكوّن | المكان | الوظيفة |
|--------|--------|---------|
| `PasswordInput` | [`src/components/auth/PasswordInput.tsx`](src/components/auth/PasswordInput.tsx) | حقل باسورد بأيقونة إظهار/إخفاء |
| `Stepper` | [`src/components/auth/Stepper.tsx`](src/components/auth/Stepper.tsx) | مؤشّر الخطوات (للتسجيل والريست) |
| `AuthSidePanel` | [`src/components/auth/AuthSidePanel.tsx`](src/components/auth/AuthSidePanel.tsx) | البانل الجانبي (صورة + مميزات) |
| معالجة الأخطاء + 429 | [`src/lib/api/errors.ts`](src/lib/api/errors.ts) | رسائل عربية موحّدة |

---

## 🎤 نقاط للمناقشة (خلاصة)

1. **الفاليديشن:** react-hook-form + zod — schema واحد، أخطاء live تحت كل حقل.
2. **الأمان:** التوكن في httpOnly cookies (مش localStorage) → محمي من XSS.
3. **التوجيه:** الباك يرجّع الدور → نوجّه لداشبورده → حمايتين (RoleGuard للداخل، GuestGuard للخارج).
4. **تجربة المستخدم:** wizard متعدد الخطوات للتسجيل + OTP، وتصميم مودرن موحّد بخط Cairo.
