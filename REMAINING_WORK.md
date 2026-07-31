# Avicena — النواقص وخطة الإكمال (Handoff)

> ملف تسليم: كل اللي **اتعمل** وكل اللي **فاضل**، عشان أي حد (أو شات تاني/جهاز تاني) يكمّل من هنا.
> الوثائق التفصيلية: `Backend/CHAT_VIDEO_FIXES.md` (كل تعديلات الباك + الـ Events Contract)،
> `Frontend/FRONTEND_GUIDE.md` (معمارية + مكتبات + حالة كل بورتال).
>
> آخر تحديث: 2026-07-31

---

## 0. تشغيل سريع (للجهاز الجديد)

```bash
# Backend يشتغل في Docker
docker compose up -d              # أو: docker start avicena-backend
# أو محليًا:
cd Backend && npm install && npm run dev     # :4000

# Frontend
cd Frontend && npm install && npm run dev    # :3000  (API على :4000)
```

**⚠️ ملاحظات تشغيل حرجة:**
- **Docker + Windows**: file-watching مبيوصلش للكونتينر → **أي تعديل باك محتاج `docker restart avicena-backend`** (وأي تغيير في `.env` كمان).
- **`.env` مطلوب** في Backend. للتجربة: `CHAT_REQUIRE_TIME_WINDOW=false` (مش مؤثر دلوقتي لأن البوابة بقت request-based، بس سيبها).
- **Socket CORS**: مسموح `localhost:3000` (+ `CLIENT_ORIGIN`). للـ deploy ضيف دومين الإنتاج.
- **بعد أي تعديل على `issueTokens`/الأدوار**: لازم **re-login** عشان التوكن الجديد.

**حسابات seed** (`node src/seed.js`): مريض `mohamed@test.com` · طبيب `khaled.doc@avicena.com` ·
أدمن `admin@avicena.com` · معمل `cairo.lab@avicena.com` — كلمات المرور: `Patient@1234` / `Doctor@1234` /
`Admin@1234` / `Lab@1234`.

---

## 1. اللي خلص ✅ (متوصّل بالباك بالكامل)

- **المريض**: داشبورد · مواعيد (حجز بنوع كشف/استشارة + إلغاء) · استشارات (إلغاء/تغيير وقت) · تقارير ·
  محادثات (request→approve + real-time + typing/read) · فيديو (WebRTC) · سجل مكالمات · اشتراك · بروفايل.
- **الطبيب**: داشبورد · مواعيد · مرضى (بحث) · تقارير (CRUD) · استشارات (إنشاء/إتمام/إلغاء) · محادثات +
  **مساعد AI (RAG)** · إعدادات (توفّر/أسعار/ساعات/مسح سلوتس).
- **المعمل**: داشبورد · تحاليل · بروفايل.
- **الأدمن**: داشبورد · أطباء (إضافة/توفّر/حذف) · مستخدمون (حظر) · مواعيد · تقارير · معامل.
- **عام**: هوم + قائمة أطباء (مودرن) + صفحة طبيب (مودرن + حجز بنوع).
- **بنية**: sidebar responsive (drawer موبايل) · جرس إشعارات · RoleGuard (بدون hydration issues).
- **إصلاحات باك كتير** (توكن بدون id، rooId typo، socket CORS، admin toggle، createConsultation…) — كلها في
  `Backend/CHAT_VIDEO_FIXES.md`.

---

## 2. الناقص — مرتّب حسب الأولوية

### 🔴 (أ) الصيدليات — أكبر نظام، الباك **جاهز 100%** والفرونت **مش مبني**
الباك: **41 endpoint** عبر 7 موديولات (`Backend/src/modules/pharmacy/*`):
`application` (تقديم→موافقة أدمن) · `pharmacy` · `products` · `inventory` (+ import-batch) ·
`order` (+ payment) · `medicine` (جداول أدوية) · `coupon` (⚠️ مش متركّب في `app.js`).

**خطة البناء (مراحل):**
1. **بورتال الصيدلية**: dashboard + منتجات (CRUD) + طلبات + مخزون.
2. **فلو المريض**: تصفّح صيدليات → منتجات → سلة → طلب (`/pharmacies` دلوقتي "قريبًا").
3. **موافقة الأدمن**: شاشة طلبات الصيدليات (`GET /api/v1/pharmacy/applications`, approve/reject) +
   شاشة تقديم صيدلية (public).
4. الكوبونات + المخزون المتقدّم.

**أول خطوة**: افحص كل موديول (routes + response keys) زي ما عملنا مع باقي البورتالات — راجع
`app.js` للـ mount paths (`/api/v1/pharmacy/...`).

### 🟠 (ب) وظائف الموقع العام (بتستخدم API موجود)
- **بحث الهيدر** (`components/public/PublicHeader.tsx`) — مش مربوط. يربط بـ `getDoctors` + filter.
- **فلاتر صفحة الأطباء** (تخصص/سعر/جنس/متاح) — شكل بس. تتعمل client-side على نتيجة `getDoctors`.
- **Pagination الأطباء** — أزرار ثابتة mock.

### 🔵 (ج) محتاج **شغل باك اند جديد** (مش موجود)
- **الدفع** — مفيش دفع خالص (اشتراكات/مواعيد/استشارات مبتخصمش). موديول order فيه `payment.service`
  للصيدلية بس. محتاج بوابة دفع + ربط.
- **حجز تحاليل المعمل** — المريض يتصفّح المعامل بس مفيش endpoint لحجز/طلب تحليل ولا رفع نتائج للمريض.
- **فلو تقديم الطبيب/المعمل** — موجود للصيدلية بس. لو عايز الطبيب/المعمل يقدّموا للموافقة، محتاج
  موديول `application` جديد لكل واحد (model + routes + approve→ينشئ حساب).

### ⚪ (د) تحسينات صغيرة
- تمييز "استشارة = فيديو أونلاين مباشر" (حاليًا النوع بيأثّر على الرسوم بس — التفاصيل في المحادثة).
- رفع صورة في بروفايل المريض/الطبيب (الفورم نصّي؛ الباك بيدعم multipart).
- صفحة إشعارات كاملة (دلوقتي dropdown بس).
- `/points` (نقاط/مكافآت) — placeholder.

### 🚀 (هـ) قبل الـ Production
- **HTTPS** — WebRTC (`getUserMedia`) بيشتغل بس على https/localhost.
- **TURN server** — الفيديو بين شبكات مختلفة (STUN لوحده مش كفاية). حاليًا `stun:stun.l.google.com`.
- ضبط CORS + `CLIENT_ORIGIN` + `FRONTEND_URL` لدومين الإنتاج (REST + Socket).
- متغيّرات البيئة (JWT secrets, Mongo, Redis, Qdrant, Cloudinary, AI keys) على سيرفر الإنتاج.

---

## 3. أنماط متكرّرة (عشان تكمّل بنفس الستايل)

- **صفحة بورتال جديدة**: React Query لـ fetch + Mutations للأكشنز (invalidate بعد النجاح). نظام
  التصميم "Clinical Clarity" (Tailwind tokens: `primary-container`, `on-surface`, `surface-container-low`,
  `text-headline-md`… + أيقونات `material-symbols-outlined`) + RTL.
- **api دومين**: ملف `features/<domain>/api.ts` — الرد شكله `{ success, message, ...data }` فبتقرأ
  المفتاح المسمّى مباشرة (`data.doctors`, `data.appointments`…). **دايمًا اتأكد من مفتاح الـ response
  من الكنترولر** (اتلسعنا كذا مرة من مفاتيح غلط).
- **بوابة الأدوار**: كل بورتال جوّه route-group + `<RoleGuard role="…">` في الـ layout.
- **auth**: cookie-based (httpOnly) — مفيش توكن في JS. اللوجين الموحّد `/api/auth/login` لكل الأدوار.

---

## 4. باجات باك اند لسه موجودة (مكتشفة، لو احتجتها)
- `getAllConsultations` (admin) بيرجّع من غير data key (زي ما كان في doctor — لو هتوصّل شاشة استشارات
  الأدمن صلّحه).
- بعض endpoints بتستخدم `req.docId`/`req.body` بطريقة متسرّبة — راجع كل controller قبل ما توصّله.
- `POST /api/admin/users/search` هو **GET** في الراوت بس بيقرأ `req.body.q` — استخدمنا فلترة client-side بدلًا منه.
