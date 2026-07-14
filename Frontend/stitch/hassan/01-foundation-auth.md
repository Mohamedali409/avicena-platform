# Batch 01 — Foundation + Auth  ⭐

**افتحي session واحد على Stitch لكل الملف ده.** ده أول batch — بيثبّت الهوية البصرية للمشروع كله، فخُدي وقتك فيه واظبطي الألوان والخطوط كويس قبل ما تكمّلي باقي الـ batches.

الشاشات: Landing · Login (موحّد) · Register · Forgot/Reset password

---

## 🎨 Design System Prompt (الصقيه في أول كل شاشة)
```
A healthcare telemedicine web app called "Avicena".
Arabic language, RTL layout. Clean clinical aesthetic:
primary teal #0e7490, white surfaces, light gray #f8fafc background, rounded-xl cards,
soft shadows, Tajawal/Cairo font, generous spacing, accessible contrast.
Status colors: green=success/active, amber=pending, red=cancelled/danger.
```

---

### شاشة 1 — Landing
```
[Design System] +
Public landing page for Avicena telemedicine. Hero with headline "استشارتك الطبية عن بُعد",
a search bar for doctors by specialization, primary "احجز الآن" button, 3 feature cards
(حجز فوري، استشارة بالفيديو، ملف طبي ذكي), a doctors preview row, and a footer.
```

### شاشة 2 — Login (موحّد للأربع أدوار)
```
[Design System] +
Centered login card. A role selector segmented control (مريض / دكتور / أدمن / معمل),
email + password fields, "دخول" teal button, "نسيت كلمة المرور؟" link, and
"إنشاء حساب" link. Soft gradient background.
```

### شاشة 3 — Register (patient)
```
[Design System] +
Patient registration card: full name, email, password, confirm password,
a terms checkbox, "إنشاء حساب" primary button, and a link back to login.
```

### شاشة 4 — Forgot / Reset password
```
[Design System] +
Two-step password reset. Step 1: email input to receive a reset link.
Step 2: new password + confirm password. Centered cards with a success confirmation state.
```

---
**بعد ما تخلّصي:** صدّري الشاشات، واحتفظي بـ screenshot للـ Login عشان تستخدميه reference في الـ batches الجاية.
**المكان في الكود:** `src/app/page.tsx` · `src/app/(auth)/login` · `src/app/(auth)/register`
