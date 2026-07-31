# Avicena Frontend — الدليل الشامل (Architecture & Libraries)

> دليل موحّد لكل اللي بنبنيه في الفرونت اند: المعمارية، المكتبات المستخدمة وإصداراتها،
> بنية المجلدات، نموذج المصادقة، طبقة الـ realtime (شات/فيديو/إشعارات)، وفلو الحجز الكامل.
> للتفاصيل الدقيقة لطبقة الشات/الفيديو بس، شوف كمان `CHAT_VIDEO_FRONTEND.md`.
>
> آخر تحديث: 2026-07-31

---

## 1. نظرة عامة

تطبيق **Next.js واحد** بيخدم 4 لوحات حسب الدور (Patient / Doctor / Admin / Lab) من نفس الدومين،
عشان الأدوار بتتفاعل مع بعض (شات، فيديو، إشعارات) فيشاركوا نفس كود الـ realtime والـ design system.
الفصل بين الأدوار عن طريق **route groups** + **RoleGuard**.

- **اللغة:** عربي أولاً / **RTL** افتراضياً.
- **الـ API:** Express على `:4000` (متغيّر `NEXT_PUBLIC_API_URL`).
- **الـ Realtime:** Socket.io على نفس الأصل (`NEXT_PUBLIC_SOCKET_URL`).

---

## 2. المكتبات المستخدمة (Libraries)

### أساسية (Runtime)
| المكتبة | الإصدار | ليه بنستخدمها |
|---|---|---|
| **next** | ^15.1.0 | الفريموورك (App Router, SSR, routing, turbopack في dev) |
| **react / react-dom** | ^19.0.0 | مكتبة الـ UI |
| **typescript** | ^5.7.2 | أنواع ثابتة عبر المشروع كله |
| **@tanstack/react-query** | ^5.62.0 | جلب/كاش بيانات الـ REST (queries/mutations) — كل fetching بيمر عليها |
| **axios** | ^1.7.9 | HTTP client (instance واحد + interceptor لتجديد التوكن) |
| **socket.io-client** | ^4.8.1 | اتصال real-time واحد مشترك (شات/فيديو/إشعارات) |
| **zustand** | ^5.0.2 | Global state خفيف (auth store) |
| **react-hook-form** | ^7.54.0 | إدارة الفورمات (login/register/booking) |
| **@hookform/resolvers** | ^3.9.1 | ربط react-hook-form بـ Zod |
| **zod** | ^3.24.1 | التحقق من صحّة الـ schemas (فورمات + بيانات) |
| **@react-oauth/google** | ^0.13.5 | تسجيل الدخول بجوجل |
| **leaflet** | ^1.9.4 | خرائط (مواقع الأطباء/المعامل) |

### تطوير (Dev)
| المكتبة | الإصدار | الغرض |
|---|---|---|
| **tailwindcss** | ^3.4.17 | التصميم (نظام "Clinical Clarity" tokens) |
| **postcss / autoprefixer** | ^8 / ^10 | معالجة CSS |
| **eslint / eslint-config-next** | ^9 / ^15 | فحص الكود |
| **vitest** | ^2.1.8 | اختبارات الوحدة |
| **@types/** node·react·react-dom·leaflet | — | أنواع TypeScript |

### واجهات المتصفح (بدون مكتبة خارجية)
- **WebRTC** (`RTCPeerConnection` / `getUserMedia`) — الفيديو كول P2P (مفيش SDK خارجي؛ الباك signaling بس).
- **Material Symbols** (خط أيقونات محمّل في `layout.tsx`) — الأيقونات (`material-symbols-outlined`).

> ملاحظة: أي مفتاح سرّي (Gemini/Cerebras/دفع) **مايتحطش هنا** — بس `NEXT_PUBLIC_*` بيوصل للمتصفح.

---

## 3. بنية المجلدات

```
src/
├── app/                              # App Router (route groups per role)
│   ├── (public)/doctors/[id]         # بروفايل الطبيب + widget الحجز (مدخل الفلو)
│   ├── (auth)/{login,register,...}   # المصادقة الموحّدة
│   ├── (patient)/patient/*           # محمي role=patient
│   │   └── chat/                     # ← جديد: قائمة المحادثات + [roomId]
│   ├── (doctor)/doctor/*             # محمي role=doctor
│   ├── (admin)/admin/*  ·  (lab)/lab/*
│   └── layout.tsx, globals.css
├── components/{public,auth,shared}   # Providers, RoleGuard, GuestGuard, هيدر/فوتر
├── features/<domain>/                # لكل دومين: api + hooks + (components)
│   ├── auth/ · doctors/ · labs/ · medical-ai/ · patient/
│   ├── booking/api.ts                # ← جديد: السلوتس + الحجز
│   ├── chat/                         # ← جديد: types + api + useChat + components/ChatRoom
│   ├── notifications/                # ← جديد: api + useNotifications
│   └── video/                        # ← جديد: types + api + useVideoCall + CallProvider + components/
├── lib/
│   ├── api/client.ts                 # axios instance + refresh interceptor  ← core
│   ├── auth/session.ts               # حفظ الجلسة (role + بروفايل خفيف) في localStorage
│   └── socket/{socket.ts, events.ts} # ← جديد: اتصال مشترك + عقد الأحداث
├── store/auth.store.ts               # zustand (login/logout/hydrate)
└── config/roles.ts                   # role → home/basePath  ← core
```

---

## 4. نموذج المصادقة (المعمول فعلاً)

- الباك بيزرع **كوكيز httpOnly** (`accessToken` / `refreshToken`) عند الـ login.
- المتصفح بيبعتها تلقائياً مع كل REST call عبر `withCredentials: true` — **مفيش توكن في الـ JS**
  (حماية من XSS). مفيش Authorization header بيتحقن يدوياً.
- على **401** لمستخدم مسجّل: الـ interceptor بينده `/api/auth/refresh` مرة واحدة ويعيد المحاولة.
- في `localStorage` بنخزّن **بيانات غير سرّية بس** (`role` + بروفايل خفيف للهيدر) عبر `session.ts`.
- **السوكت** بيستخدم نفس الكوكيز (`withCredentials`) — الباك بيقرأ `accessToken` من الكوكي.

> (الـ `README.md` القديم بيذكر headers لكل دور — الواقع الحالي **cookie-based** زي ما فوق.)

---

## 5. طبقة الـ Realtime (اللي بنبنيها)

### اتصال واحد مشترك
`lib/socket/socket.ts` → `getSocket()` بيرجّع نفس الـ instance. يتفتح بعد الـ login،
ويتقفل عند الـ logout (`disconnectSocket()` متعمول في auth.store).

### عقد الأحداث
`lib/socket/events.ts` → `SOCKET_EVENTS` = مصدر الحقيقة الوحيد لأسماء الأحداث (مطابق للباك).

### الـ Features
| الدومين | الملفات | المحتوى |
|---|---|---|
| **chat** | `types.ts`, `api.ts`, `useChat.ts`, `components/ChatRoom.tsx` | REST للهيستوري + hook الغرفة (send/receive/typing/read، optimistic) + UI جاهز |
| **video** | `types.ts`, `api.ts`, `useVideoCall.ts` | WebRTC كامل: signaling + media + كنترولز (mic/cam/end) |
| **notifications** | `api.ts`, `useNotifications.ts` | عداد unread حيّ + آخر الإشعارات |
| **booking** | `api.ts` | `getAvailableSlots` + book/list/cancel |

---

## 6. الفلو الكامل (Booking → Request → Approve → Chat → Video)

> **مهم**: البوابة بقت **بموافقة الطبيب** (مش نافذة الحجز الزمنية).

```
1) صفحة الطبيب (public/doctors/[id]):
   اختيار نوع الزيارة (كشف/استشارة) → getAvailableSlots → bookAppointment(docId, date, time, type)
2) المريض من "مواعيدي" → زر "اطلب محادثة" → sendChatRequest(docId, firstMessage)
3) الطبيب من "المحادثات" → قسم الطلبات → قبول/رفض (acceptChatRequest/rejectChatRequest)
4) بعد القبول: المريض يفتح /patient/chat/[roomId] → useChat → رسائل real-time
5) من هيدر الغرفة: زر 📹 → useVideoCall().startCall(otherId, type)
   (الفيديو بنفس بوابة الموافقة)
```

الجرس (`useNotifications`) بيدي المريض/الطبيب تنبيه لحظي عند الطلب/القبول/الرسالة/المكالمة.

---

## 7. حالة التنفيذ (Built)

**كل البورتالات مكتملة ومتوصّلة بالباك.** التفاصيل الكاملة للنواقص في **`../REMAINING_WORK.md`** (روت الريبو).

### الطبقة الأساسية ✅
- socket (اتصال مشترك + `events.ts`) · chat (api + `useChat` + `ChatRoom` + request/approve) ·
  video (WebRTC كامل: `useVideoCall` + `CallProvider` + `CallScreen` + `IncomingCallModal` +
  `CallHistory`) · notifications (`useNotifications` + `NotificationBell`) · booking (slots + حجز بنوع).

### بورتال المريض ✅
داشبورد (stats + مواعيد قادمة) · مواعيدي (+ إلغاء + طلب محادثة) · استشاراتي (+ إلغاء/تغيير وقت) ·
تقاريري · المحادثات (+ فيديو + سجل مكالمات) · الاشتراك (خطط) · الملف الشخصي.

### بورتال الطبيب ✅
داشبورد (أرباح + عدّادات + أحدث النشاط) · المواعيد (إتمام/إلغاء) · المرضى (بحث + محادثة) ·
التقارير (عرض/إضافة/تعديل/حذف) · الاستشارات (إنشاء/إتمام/إلغاء) · المحادثات + **مساعد AI**
(`MedicalAIPanel`) · الإعدادات (توفّر/أسعار/ساعات + مسح سلوتس).

### بورتال المعمل ✅
داشبورد · قائمة التحاليل · بروفايل (عرض/تعديل).

### بورتال الأدمن ✅
داشبورد · الأطباء (إضافة/توفّر/حذف) · المستخدمون (بحث/حظر) · المواعيد (إتمام/إلغاء) ·
التقارير (حذف) · المعامل (عرض).

### الواجهة العامة ✅ / 🚧
- ✅ الهوم · قائمة الأطباء (كروت مودرن، clickable) · صفحة الطبيب (هيرو مودرن + رسوم كشف/استشارة).
- 🚧 بحث الهيدر + فلاتر الأطباء (شكل بس) · pagination الأطباء (ثابت).

### shell مشترك ✅
`PortalSidebar` (drawer responsive على الموبايل عبر `store/ui.store`) · `PortalHeader` (+ جرس) ·
`RoleGuard` (mounted pattern — بدون hydration mismatch).

> **الناقص كله** (الصيدليات، الدفع، حجز التحاليل، ...) في **`../REMAINING_WORK.md`**.

---

## 8. التشغيل

```bash
cp .env.example .env     # NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SOCKET_URL, GOOGLE_CLIENT_ID
npm install
npm run dev              # http://localhost:3000  (الـ API متوقّع على :4000)
```

**سكربتات:** `dev` (turbopack) · `build` · `start` · `lint` · `test` (vitest).

> نصيحة للتجربة: خلّي `CHAT_REQUIRE_TIME_WINDOW=false` في الباك عشان الشات/الفيديو يفتحوا
> بأي وقت طول ما فيه حجز نشط، من غير ما تستنى نافذة الميعاد.
