# Chat & Video-Call — Backend Fixes & Frontend Integration Guide

> ملف توثيقي للمشاكل اللي اتلاقت في الباك اند الخاص بالـ Socket.io (الشات + الفيديو كول)،
> إزاي اتحلّت، والفلو الصح اللي المفروض الفرونت اند يمشي عليه (الحجز → فتح الشات/الفيديو).
>
> آخر تحديث: 2026-07-31

---

## 1. الملخّص السريع

الباك اند بتاع الشات والفيديو مبني كويس معمارياً (modular + socket handlers منفصلة)، بس كان فيه
**8 باجات** أغلبها كان بيكسر الفلو تماماً (السوكت مش بيعمل authenticate أصلاً، والشات request مكسور).
كل الباجات اللي بتكسر الشغل اتصلّحت واتعملها syntax-check. تحت التفاصيل الكاملة + جدول الأحداث
(events contract) اللي الفرونت هيتبني عليه.

**الحالة دلوقتي:** الأساس شغّال — تقدر تعمل connect، تبعت request، الدكتور يقبل، والرسائل تتبعت
real-time، وإشارات الـ WebRTC تتبادل.

---

## 2. المشاكل اللي اتلاقت وإزاي اتحلّت

### 🔴 (1) السوكت مش بيعمل Authentication أصلاً — أخطر مشكلة
- **الملف:** `src/infrastructure/socket/socket.auth.js`
- **المشكلة:** الميدلوير كان بيقرأ التوكن من `handshake.auth.token` أو `headers.token` بس، ومكانش
  بيقرأ من الكوكيز. لكن الفرونت (Next.js) بيخزّن التوكن في **httpOnly cookie** (`accessToken`) اللي
  الـ JS مش بيقدر يقراه، وبيبعت `{ role }` بس في الـ handshake. النتيجة: **كل اتصال سوكت كان بيفشل**.
  كمان كان بيعمل `throw` جوّه الميدلوير بدل `next(err)` — وده في Socket.IO بيسيب الـ handshake معلّق.
- **الحل:** الميدلوير بقى يقرأ التوكن من 3 مصادر بالترتيب: `auth.token` → `headers.token` →
  الكوكي (`accessToken` / `token` / `dtoken`)، بنفس منطق الـ REST guards. أضفت parser للـ cookie
  header، وبقى يستخدم `next(new Error(...))` بدل `throw`. كده الفرونت اللي شغّال بالكوكيز يشتغل من غير
  ما نكسر أمان الـ httpOnly.

### 🔴 (2) إرسال أي رسالة فيها receiverId كان بيضرب Crash
- **الملف:** `src/modules/chat/chat.socket.js`
- **المشكلة:** الاستيراد اسمه `notificationService` لكن الكود بينادي `notifService.createNotification(...)`
  → `ReferenceError` وكل رسالة فيها `receiverId` كانت بترجّع `chat:error`.
- **الحل:** توحيد الاسم لـ `notificationService`.

### 🔴 (3) إرسال طلب الشات (sendRequest) مكسور تماماً
- **الملف:** `src/modules/chat/chat-request.controller.js`
- **المشكلة:** بيعمل destructure لـ `doct` من الـ body، لكن بيمرّر متغيّر اسمه `docId` (مش معرّف) →
  الـ endpoint كله بيرمي error.
- **الحل:** التصحيح لـ `const { docId, initialMessage } = req.body`.

### 🔴 (4) قبول/رفض الطلب مش بيتحدّث في الداتابيز
- **الملف:** `src/modules/chat/chat-request.repository.js`
- **المشكلة:** `updateLatestStatus` كان بيستخدم `findByIdAndUpdate({ roomId }, ...)`، و
  `findByIdAndUpdate` بياخد **id** مش filter object → التحديث كان بيفشل (accept/reject مبيشتغلوش).
- **الحل:** استبدالها بـ `findOneAndUpdate({ roomId }, ...)`.

### 🟠 (5) رفض الطلب كان بيحفظه كـ "accepted"
- **الملف:** `src/modules/chat/chat.request.service.js` (`rejectRequest`)
- **المشكلة:** بينادي `updateLatestStatus(roomId, "accepted", ...)` بدل `"rejected"` → الطلب المرفوض
  كان بيتفتح بدل ما يترفض (ثغرة منطقية خطيرة).
- **الحل:** تغييرها لـ `"rejected"`.

### 🟠 (6) فحص طول الرسالة الأولى غلط منطقياً
- **الملف:** `src/modules/chat/chat.request.service.js` (`sendChatRequest`)
- **المشكلة:** `!initialMessage.trim().length > 500` بتتقيّم كـ `(!length) > 500` = `false > 500` =
  دايماً `false` → الحد الأقصى للطول مبيشتغلش خالص.
- **الحل:** تصحيحها لـ `initialMessage.trim().length > 500`.

### 🟠 (7) فرع كود ميّت في التحقق من الطلب
- **الملف:** `src/modules/chat/chat.request.service.js` (`sendChatRequest`)
- **المشكلة:** فيه شرطين `if (latest.status === "pending")` ورا بعض — التاني مستحيل يتنفّذ، وكان المقصود
  منه حالة `"accepted"` (الشات مفتوح بالفعل).
- **الحل:** تعديل الفرع التاني لـ `latest.status === "accepted"`.

### 🟡 (8) عدم اتساق أسماء أحداث الفيديو (WebRTC)
- **الملف:** `src/modules/video-call/video.socket.js`
- **المشكلة:** بعض الأحداث بشرطة (`call-accept`, `call-offer`, `call-answer`) والباقي بـ `:`
  (`call:offer`, `call:ice-candidate`...). ده كان هيبوّظ الفرونت لأن الأسماء لازم تتطابق بالحرف.
- **الحل:** توحيد كل الأحداث على نمط `call:` (اللي الفرونت هيتطابق معاه من جدول الأحداث تحت).
  اتساب **alias** لـ `call-accept` القديم عشان الـ backward-compatibility.

> ملاحظة: مفيش أي فرونت اند بيعتمد على الأحداث دي لسه، فالتوحيد آمن.

---

## 3. Events Contract (المرجع اللي الفرونت هيتبني عليه)

### الاتصال + الحضور (Presence)
| الاتجاه | الحدث | الـ Payload |
|---|---|---|
| C→S | `presence:check` | `{ userId }` |
| S→C | `presence:status` | `{ userId, online }` |
| S→C (broadcast) | `presence:online` | `{ userId }` |
| S→C (broadcast) | `presence:offline` | `{ userId }` |

عند الاتصال المستخدم بيدخل روم شخصي `user:${userId}` تلقائياً (للإشعارات + المكالمات الواردة).

### الشات (Chat) — مبني على rooms، `roomId = ${sortedIdA}_${sortedIdB}`
| C→S | Payload | | S→C | Payload |
|---|---|---|---|---|
| `chat:join` | `roomId` | | `chat:message` | الرسالة المحفوظة (لباقي الروم) |
| `chat:leave` | `roomId` | | `chat:message:sent` | الرسالة المحفوظة (للمُرسِل) |
| `chat:message` | `{ roomId, receiverId, message }` | | `chat:typing` | `{ roomId, senderId }` |
| `chat:typing` | `{ roomId }` | | `chat:stopTyping` | `{ roomId, senderId }` |
| `chat:stopTyping` | `{ roomId }` | | `chat:read` | `{ roomId, readerId }` |
| `chat:read` | `{ roomId }` | | `chat:error` | `{ message }` |

**قاعدة البوابة (Gating):** لو الدور مش `doctor`، الباك بينفّذ `assertChatAllowed` — لازم يكون فيه
طلب شات **accepted** بين الاتنين، وإلا بيرجّع `chat:error`.

### الفيديو كول (WebRTC Signaling — الباك signaling فقط، الميديا P2P)
| C→S | Payload | | S→C | Payload |
|---|---|---|---|---|
| `call:initiate` | `{ receiverId, receiverType, consultationId, type }` | | `call:incoming` | `{ callerId(=call _id), roomId, from, callerType, type }` |
| `call:accept` | `{ callId, roomId }` | | `call:initiated` | `{ callId, roomId }` |
| `call:reject` | `{ callId, targetId }` | | `call:accepted` | `{ callId, roomId, from }` |
| `call:end` | `{ callId, roomId, targetId }` | | `call:rejected` | `{ callId, from }` |
| `call:offer` | `{ targetId, offer, roomId }` | | `call:ended` | `{ callId, from, duration }` |
| `call:answer` | `{ targetId, answer, roomId }` | | `call:offer` | `{ from, offer, roomId }` |
| `call:ice-candidate` | `{ targetId, candidate, roomId }` | | `call:answer` | `{ from, answer, roomId }` |
| | | | `call:ice-candidate` | `{ from, candidate, roomId }` |
| | | | `call:error` | `{ message }` |

> مهم للفرونت: الـ `offer`/`answer`/`ice-candidate` بتتبعت **مباشرة على `user:${targetId}`** (مش على
> الـ call room)، فوجّهها دايماً بـ `targetId`. أما `accept`/`end` بتتبَثّ على الـ `roomId`.

### الإشعارات (Notifications)
| C→S | | S→C |
|---|---|---|
| `notification:fetchUnread` | → | `notification:UnreadCount` `{ count }` |
| `notification:markAllRead` | → | `notification:allRead` |
| | | `notification:new` (بيتدفع تلقائياً: رسالة/طلب/مكالمة) |
| | | `notification:error` `{ message }` |

### REST Endpoints (كلها cookie-auth؛ الراوتر بيميّز الدكتور بوجود `dtoken`)
**Chat**
- `POST /api/chat/request` — `{ docId, initialMessage }`
- `POST /api/chat/my-requests`
- `POST /api/chat/doctor/requests` — `?status=`
- `POST /api/chat/doctor/request/accept` — `{ roomId }`
- `POST /api/chat/doctor/request/reject` — `{ roomId, rejectReason }`
- `GET  /api/chat/conversations`
- `GET  /api/chat/room/:otherId/id` — يرجّع الـ roomId
- `GET  /api/chat/room/:roomId` — الرسائل (`?page&limit`, افتراضي 30)
- `GET  /api/chat/room/:roomId/unread`
- `GET  /api/chat/room/:roomId/read`

**Video**
- `GET /api/video-call/history` — `?page&limit`
- `GET /api/video-call/:id`

---

## 4. الفلو الصح: الحجز → فتح الشات/الفيديو

### الوضع الحالي (مهم جداً)
النهاردة فيه **بوابتين مختلفتين** ومش مربوطين ببعض:
1. **بوابة الشات الحالية = chat-request:** المريض يبعت request → الدكتور يقبل → الشات يفتح.
2. **الحجز (appointment/consultation):** لسه **skeleton** — موجود منهم `getById` بس. **مفيش**
   endpoint لإنشاء حجز، ولا سلوتس، ولا ربط الحجز بفتح الشات.

يعني حالياً الشات بيتفتح عن طريق الـ request، **مش** عن طريق الحجز. وده مختلف عن الفلو اللي إنت عايزه
(المريض يحجز → يتحدد معاد → الشات/الفيديو يتفتح).

### القرار للمرحلة دي
عشان نخلّص ونجرّب دلوقتي: **نسيب بوابة الشات الحالية (chat-request) شغّالة زي ما هي** (اتصلّحت وبقت
تشتغل)، ونأجّل ربط الحجز لحد ما نكمّل موديول الحجز. لما نجهّز الحجز، نبدّل `assertChatAllowed` بحيث
يتأكد من وجود **appointment/consultation مدفوع وفي وقته** بدل الـ request.

### اللي ناقص في الباك عشان فلو الحجز الكامل (مؤجّل — مش دلوقتي)
- [ ] `POST /api/appointment` — إنشاء حجز (userData/docData/slot/amount/payment).
- [ ] عرض السلوتس المتاحة للدكتور + منع الـ double-booking.
- [ ] Cancel / Reschedule.
- [ ] إنشاء `Consultation` من الـ appointment (الـ `consultationId` اللي المكالمة بتستخدمه موجود في الموديل بالفعل).
- [ ] تعديل `assertChatAllowed` (والفيديو) عشان الجيت يكون: "فيه حجز مؤكّد بينهم في وقته".

---

## 5. اللي الفرونت اند لازم يبنيه **قبل** الشات (عشان الفلو يبقى واضح)

الترتيب المنطقي للتنفيذ في الفرونت:

1. **إصلاح طبقة السوكت** *(جاهزة من ناحية الباك دلوقتي)* — تأكيد إن `lib/socket/socket.ts` بيعمل connect
   بالكوكيز (بقى شغّال بعد إصلاح الـ auth). مفيش تغيير مطلوب في الفرونت غير التأكد إن الـ URL صح.

2. **صفحة/فلو الحجز (Booking)** — دي المدخل. المريض يختار دكتور → يختار سلوت → يأكّد الحجز.
   *(دلوقتي الباك لسه بيبني endpoint الإنشاء — فمؤقتاً ممكن الفرونت يستخدم بوابة الـ chat-request كمدخل
   للتجربة: المريض يبعت "طلب تواصل" للدكتور بدل حجز كامل.)*

3. **قائمة المحادثات / الطلبات (Conversations & Requests)**
   - المريض: زرار "ابدأ محادثة" → `POST /api/chat/request`، وشاشة تتابع حالة الطلب (pending/accepted/rejected).
   - الدكتور: Inbox للطلبات (`/doctor/requests`) مع Accept/Reject.

4. **دخول غرفة الشات (Chat Room)** — بعد ما الطلب يتقبل:
   - `GET /api/chat/room/:otherId/id` → ياخد الـ roomId.
   - `socket.emit("chat:join", roomId)`.
   - `GET /api/chat/room/:roomId` → تحميل الهيستوري.
   - listeners لـ `chat:message` / `chat:message:sent` / typing / read.

5. **الفيديو كول** — من جوّه غرفة الشات (زرار اتصال): `call:initiate` + طبقة WebRTC (RTCPeerConnection)
   بتتبادل `offer`/`answer`/`ice-candidate` عبر السوكت زي جدول الأحداث.

**الخلاصة:** الحاجة اللي لازم تتنفّذ في الفرونت **قبل** الشات هي **مدخل الدخول للمحادثة** (الحجز أو
طلب التواصل + قبول الدكتور) — من غيره مفيش `roomId` ولا صلاحية دخول. الشات نفسه ييجي بعد كده.

---

## 6. الملفات اللي اتعدّلت في الإصلاح ده
- `src/infrastructure/socket/socket.auth.js` — قراءة التوكن من الكوكي + `next(err)`.
- `src/modules/chat/chat.socket.js` — إصلاح `notificationService`.
- `src/modules/chat/chat-request.controller.js` — إصلاح `docId`.
- `src/modules/chat/chat-request.repository.js` — `findOneAndUpdate`.
- `src/modules/chat/chat.request.service.js` — status الرفض + منطق التحقق + الفرع الميّت.
- `src/modules/video-call/video.socket.js` — توحيد أسماء أحداث `call:` + alias.

---

## 7. سجل التعديلات (Changelog) — خطوة بخطوة

### [2026-07-31] إضافة: endpoint السلوتس المتاحة (Available Booking Slots)

**المشكلة:** كان فيه حجز (`POST /api/user/appointments`) بيتحقق إن السلوت مش محجوز، لكن **مفيش أي
endpoint يرجّع للمريض السلوتس الفاضية** لدكتور في يوم معيّن. الفرونت كان لازم يخمّن الأوقات أو يبنيها
يدوي — مالوش مصدر رسمي، وده أول خطوة لازمة في فلو الحجز قبل الشات.

**الحل:** أضفت endpoint **public** يحسب السلوتس المتاحة من ساعات عمل الدكتور (`start_booked`) ناقص
المحجوز (`slots_booked[date]`)، ومع تجاهل الأوقات اللي فاتت لو التاريخ هو النهاردة.

**الـ Endpoint:**
```
GET /api/doctor/:id/slots?date=YYYY-MM-DD        (بدون توثيق — متاح للمريض قبل تسجيل الدخول)
```
**الـ Response:**
```json
{
  "slots": {
    "date": "2026-08-05",
    "available": ["09:00", "09:15", "09:30", "..."],
    "booked": ["10:00"],
    "working": { "from": 9, "to": 16, "booking_period": 15 },
    "doctorAvailable": true
  }
}
```
- الوقت بفورمات `"HH:MM"` (24 ساعة) — **نفس الـ string** اللي المريض هيبعته في `slotTime` وقت الحجز،
  فالمطابقة مع `isSlotTaken`/`addSlot` مضمونة.
- الـ `date` لازم يكون بنفس فورمات `slotDate` المستخدم في الحجز.
- آخر سلوت هو آخر بداية بتسع فترة كاملة قبل ساعة النهاية (مثال: 9→16 كل 15 دقيقة ⇒ آخر سلوت 15:45).

**منطق التوليد** (دالة نقية قابلة لإعادة الاستخدام):
`generateDaySlots(from, to, period)` في `src/shared/utils/slots.utils.js`.

**الملفات المتأثرة:**
- `src/shared/utils/slots.utils.js` — دالة `generateDaySlots` الجديدة.
- `src/modules/doctors/doctor.service.js` — دالة `getAvailableSlots` (+ import + export).
- `src/modules/doctors/doctor.controller.js` — هاندلر `getAvailableSlots` (+ export).
- `src/modules/doctors/doctor.routes.js` — راوت public `GET /:id/slots` قبل `doctorGuard`.

**ملاحظات (لسه مؤجّلة):** ده بيغطّي اختيار السلوت للحجز فقط. الدفع والحجز الأوفلاين لسه مؤجّلين.

---

### [2026-07-31] ربط الحجز بالشات/الفيديو + نافذة زمنية لفتح الغرفة

**المشكلة:** بوابة الشات كانت بتعتمد على **chat-request** بس (المريض يبعت طلب → الدكتور يقبل)، والفيديو
كان **مفتوح بدون أي بوابة** خالص. ده مخالف للفلو المطلوب: "المريض يحجز ويتحدد معاد → الشات/الفيديو
يتفتحوا قرب الميعاد".

**الحل:** بوابة موحّدة مبنية على الحجز (`assertConsultationAccess`) بتتأكد إن:
1. فيه **حجز نشط** (غير ملغي) بين المريض والدكتور، و
2. **الوقت الحالي جوّه نافذة الحجز**: من `slotTime − CHAT_OPEN_BEFORE_MIN` لحد `slotTime + CHAT_OPEN_AFTER_MIN`.

اتطبّقت على:
- **الشات:** `assertChatAllowed` بقت تستخدم بوابة الحجز كـ **primary**، ولو مفيش حجز صالح بتقع على
  **fallback** للـ chat-request المقبول (legacy — عشان الفلو القديم ما يتكسرش أثناء انتقال الفرونت).
- **الفيديو:** `call:initiate` بقى بيستدعي نفس البوابة للمريض (الدكتور بيتصل بحرية زي الشات).

**الإعدادات (env — كلها اختيارية بـ defaults):**
| المتغيّر | الافتراضي | الوصف |
|---|---|---|
| `CHAT_OPEN_BEFORE_MIN` | `15` | الغرفة تفتح قبل الميعاد بكام دقيقة |
| `CHAT_OPEN_AFTER_MIN` | `60` | تفضل مفتوحة بعد الميعاد بكام دقيقة |
| `CHAT_REQUIRE_TIME_WINDOW` | `true` | لو `false` → يكفي وجود حجز نشط بأي وقت (مفيد للتجربة من غير سلوت في وقته) |

**السلوك عند الرفض** (بيتبعت كـ `chat:error` أو `call:error`):
- مفيش حجز: `"لا يوجد حجز مع هذا الطبيب — احجز موعدًا أولًا لفتح المحادثة"`
- برّه النافذة: `"المحادثة تُفتح فقط قرب موعد الحجز المحدد"`

**ملاحظات تقنية:**
- `parseSlotDateTime` بيقرأ `slotDate` (`YYYY-MM-DD`) + `slotTime` (`HH:MM`) بتوقيت السيرفر المحلي،
  وبيتجنّب مشكلة UTC. لو التاريخ مش متقري → البوابة **مبتقفلش** على النافذة (بتكتفي بوجود الحجز).
- `findActiveByUserAndDoctor` بيستخدم `cancelled: { $ne: true }` عشان يشمل الحجوزات اللي `cancelled`
  فيها `undefined` (بسبب غياب الـ default في الموديل — البند 6 في قسم النواقص).

**الملفات المتأثرة:**
- `src/modules/appointments/appointment.service.js` — `assertConsultationAccess` + helpers للنافذة.
- `src/modules/appointments/appointment.repository.js` — `findActiveByUserAndDoctor`.
- `src/modules/chat/chat.request.service.js` — `assertChatAllowed` (بوابة الحجز + fallback).
- `src/modules/video-call/video.socket.js` — بوابة على `call:initiate`.

**لسه ناقص للفلو الكامل:** الدفع (`payment=true` قبل الفتح)، الحجز الأوفلاين (تمييز `type`).

---

### [2026-07-31] إصلاح باجات الحجز 6 / 7 / 8

**(6) حقل `cancelled` من غير `default` → منع التعارض بيفشل بصمت**
- **المشكلة:** `cancelled` / `payment` / `isCompleted` في الموديل كانوا `required: false` من غير
  `default`، فالحجز الجديد بيتخزّن بـ `cancelled: undefined`. أي فلتر بيدوّر بـ `cancelled: false`
  (زي `findConflictingAppointment`) **مبيلاقيش** الحجوزات النشطة → منع الحجز المزدوج لنفس المريض كان
  بيفشل بصمت.
- **الحل:** إضافة `default: false` للتلاتة. دلوقتي الفلاتر بتشتغل صح، والـ partial index تحت بقى ممكن.

**(7) Race condition — إمكانية حجز نفس السلوت مرتين**
- **المشكلة:** الحجز كان بيعمل `isSlotTaken` (فحص) ثم `addSlot` (كتابة) وده **مش atomic**؛ لو اتنين
  حجزوا نفس اللحظة ممكن الاتنين يعدّوا. مفيش أي قيد على مستوى الـ DB.
- **الحل:**
  1. **partial unique index** على `(docId, slotDate, slotTime)` بشرط `cancelled: false` — يعني السلوت
     الملغي بيتفضّى ويتحجز تاني، لكن نشطين اتنين مستحيل.
  2. إعادة ترتيب `bookAppointment`: **إنشاء الحجز الأول** (الـ index هو الحارس الذرّي)، وبعدها بس
     نحجز السلوت على الدكتور — عشان الخسران في السباق ما يبوّظش `slots_booked`.
  3. مسك خطأ التكرار `E11000` وتحويله لـ **409** نظيف: `"This time slot is already booked"`.

**(8) `Report` غير مستورد في appointment.repository → crash في إحصائيات المريض**
- **المشكلة:** `getCountDocumentsByUserId` كان بيستخدم `Report.countDocuments(userId)` و`Report` مش
  مستورد أصلاً → كان بيضرب crash. وهي **مستخدمة فعلاً** في `getPatientStats` بموديول الدكتور.
- **الحل:** استبدالها بـ `Appointment.countDocuments({ userId })` (النية الأصلية = عدّ مواعيد المريض).

**ملاحظة تشغيلية:** الـ index بيتبني تلقائياً لما mongoose يتصل (autoIndex مفعّل خارج production).
لو فيه بيانات قديمة فيها حجوزات نشطة مكرّرة، لازم تتنضّف قبل ما الـ index يتبني.

**الملفات المتأثرة:**
- `src/modules/appointments/appointment.model.js` — defaults + partial unique index.
- `src/modules/appointments/appointment.repository.js` — إصلاح `getCountDocumentsByUserId`.
- `src/modules/User/patient/patient.service.js` — إعادة ترتيب `bookAppointment` + مسك `E11000`.

**بعد الإصلاح ده، اللي فاضل للفلو الكامل:** الدفع والحجز الأوفلاين فقط.

---

### [2026-07-31] إصلاح: استشارات الدكتور مبترجعش في الـ response

**المشكلة:** `getConsultations` في `doctor.controller.js` بيجيب `consultations` من السيرفيس لكن
بيبعت `successResponse(res, "...")` **من غير ما يمرّر الداتا** → الـ endpoint
`GET /api/doctor/consultations` كان بيرجّع رسالة نجاح فاضية، وصفحة استشارات الدكتور في الفرونت
مكانش ممكن تعرض أي بيانات.

**الحل:** تمرير الداتا: `successResponse(res, "...", { consultations })`.

**الملف:** `src/modules/doctors/doctor.controller.js`.

---

### [2026-07-31] إصلاح: الـ Socket.io CORS مكانش بيسمح لـ Next.js (:3000)

**المشكلة:** الـ Socket.io CORS في `socket.server.js` كان مسموح فيه `:5173` / `:5174` /
`FRONTEND_URL` بس. بما إن الفرونت (Next.js) بيشتغل على **:3000**، أي اتصال سوكت من الفرونت كان
**بيتبلوك** (الشات/الفيديو/الإشعارات مبتشتغلش خالص).

**الحل:** إضافة `http://localhost:3000` للـ origins + قراءة `CLIENT_ORIGIN` (comma-separated) لو
موجودة عشان الإنتاج.

**الملف:** `src/infrastructure/socket/socket.server.js`.

**ملاحظة تشغيل:** لازم **restart** للباك عشان ياخد التعديل ده وأي تغيير في `.env`.

---

### [2026-07-31] إصلاح: قائمة المحادثات بترجع فاضية دايماً (`rooId` typo)

**المشكلة:** `getRoomsForParticipant` في `chat.repository.js` بيعمل `$match` على حقل اسمه **`rooId`**
(غلطة إملائية) بدل `roomId` → الـ aggregate مبيطابقش أي رسالة → `GET /api/chat/conversations`
بيرجّع **قائمة فاضية دايماً** للمريض والدكتور، حتى لو فيه رسائل فعلية.

**الحل:** تصحيح الحقل لـ `roomId`، وتحسين الـ regex بـ anchors صح
(`(^${id}_)|(_${id}$)`) عشان يطابق المشارك سواء كان أول أو تاني نص في `roomId`.

**الملف:** `src/modules/chat/chat.repository.js`.

---

### [2026-07-31] 🔴 إصلاح جذري: توكن اللوجين الموحّد بيطلع من غير `id`

**المشكلة (كانت بتكسر الشات/الإشعارات للدكتور بالكامل):** `issueTokens(user)` في
`auth.tokens.js` بيبني الـ payload من `user._id`، لكن اللوجين الموحّد (`/api/auth/login`) بينده
`issueTokens({ id: user._id, role })` — أي بيبعت مفتاح `id` مش `_id`. فـ `payload.id = user._id`
بيطلع **`undefined`**، والتوكن الناتج يبقى `{ role }` **من غير id**. النتيجة:
- `authGuard` بيحط `req.userId = decoded.id = undefined` → `GET /api/chat/conversations` بيرمي
  `Cannot read properties of undefined (reading 'toString')` (500) → القائمة تظهر فاضية.
- **Socket auth** بيحط `socket.userId = undefined` → اتصال السوكت مرفوض → الدكتور مبيستقبلش رسائل
  ولا إشعارات ولا يدخل أي روم.
- (المريض كان شغّال لأنه فعّل إيميله عبر verify-email اللي بيوقّع توكن فيه `id` مباشرة، مش عبر
  `issueTokens`.)

**الحل:** خلّي `issueTokens` يقبل الاتنين: `const id = user._id ?? user.id;` ويستخدمه في الـ payload
و`saveRefreshToken`.

**الملف:** `src/modules/auth/auth.tokens.js`.

**⚠️ مهم بعد الإصلاح:** أي حساب سجّل دخول عبر اللوجين الموحّد قبل الإصلاح عنده توكن **قديم بدون id** —
لازم **يعمل logout ثم login تاني** عشان ياخد توكن صحيح.

---

## 🐳 ملاحظة تشغيل مهمة (Docker)

الباك بيشتغل في كونتينر `avicena-backend` مع volume mount (`./Backend:/app`)، لكن على
**Docker Desktop / Windows** الـ file-watching غالبًا مبيوصلش للكونتينر — يعني **nodemon مبيعملش
reload تلقائي** لتعديلات الكود. **أي تعديل في الباك محتاج restart يدوي للكونتينر:**

```bash
docker restart avicena-backend
```

(وأي تغيير في `.env` كمان محتاج restart لأنه بيتقري وقت الإقلاع.)

---

### [2026-07-31] تغيير الفلو: بوابة الشات بموافقة الطبيب (request/approve)

**القرار:** بدل ما الحجز يفتح الشات تلقائيًا، بقى **الطبيب لازم يوافق على المحادثة**. المريض يبعت
**طلب محادثة** (برسالة أولى) → الطبيب يقبل/يرفض → الشات يفتح.

**التغييرات:**
1. **`assertChatAllowed`** (`chat.request.service.js`): بقت تعتمد على **طلب المحادثة المقبول** فقط
   (مش على الحجز). الحالات: لا يوجد طلب / pending / rejected → ترفض برسالة مناسبة؛ accepted → تفتح.
   (اتشال الاعتماد على `appointmentService`.)
2. **الفيديو** (`video.socket.js`): `call:initiate` للمريض بقى يستخدم نفس بوابة الموافقة
   (`requestService.assertChatAllowed`) بدل بوابة الحجز — فمفيش مكالمة قبل موافقة الطبيب.
3. **باج endpoints الدكتور** (`chat-request.controller.js`): كانت بتقرأ `req.docId` والراوت بيستخدم
   `authGuard` اللي بيحط `req.userId` (اللوجين الموحّد) → `undefined`. اتصلحت لـ `req.userId ?? req.docId`
   (getDoctorRequests / accept / reject).

**ملاحظة:** الحجز لسه مطلوب كخطوة منفصلة (لجدولة الزيارة)، بس مبقاش هو بوابة الشات.
نظام `assertConsultationAccess` (نافذة الحجز الزمنية) لسه موجود لو حبينا نرجّعه لاحقًا.

**الملفات:** `chat.request.service.js` · `video.socket.js` · `chat-request.controller.js`.

---

### [2026-07-31] إصلاح: إنشاء الاستشارة (createConsultation) كان بيفشل

**المشكلة:** `createConsultation` (`doctor.service.js`) مكانش بيمرّر **`consultTime`** (والموديل بيطلبه
required) وكان بيحفظ الحقل باسم غلط **`appointmentDate`** بدل `appointmentData` (المطلوب في الموديل)
→ `POST /api/doctor/consultations` بيرمي validation error دايمًا.

**الحل:** إضافة `consultTime` للـ destructure + التحقق منه، وتمرير `consultTime` و`appointmentData`
الصح للـ repo.

**الملف:** `src/modules/doctors/doctor.service.js`.

---

### [2026-07-31] ميزة: اختيار نوع الزيارة عند الحجز (كشف / استشارة)

**المشكلة:** صفحة الدكتور بتعرض `fees` و`consultation_fees`، لكن الحجز كان بياخد **`doctor.fees`
دايمًا** ومفيش طريقة يختار المريض بين كشف واستشارة.

**الحل:**
- `appointment.model.js`: حقل جديد **`type`** (`examination` | `consultation`, default `examination`).
- `patient.service.js` (`bookAppointment`): بيقبل `type` ويحسب `amount` حسبه
  (`consultation` → `consultation_fees`، وإلا `fees`) ويحفظ الـ `type` على الموعد.
- الفرونت: اختيار (كشف/استشارة) في `BookingWidget` بيحدّث الرسوم المعروضة ويبعت `type`.

**الملفات:** `appointment.model.js` · `User/patient/patient.service.js`.

---

### [2026-07-31] إصلاح: تبديل توفّر الطبيب (أدمن) كان بيفشل

**المشكلة:** `toggleAvailability` في `admin.controller.js` كان بينده
`adminService.toggleDoctorAvailability(req.body, req.body.docId)` — بيمرّر **`req.body`** (object)
كأول باراميتر، والسيرفس بيقرأه كـ `docId` → `findDoctorById(object)` بيفشل.

**الحل:** `toggleDoctorAvailability(req.body.docId)`.

**الملف:** `src/modules/User/admin/admin.controller.js`.

---

### [2026-07-31] إصلاح فرونت: مفاتيح Medical-AI response

**المشكلة:** `features/medical-ai/api.ts` كان بيقرأ `data.data`، لكن الكنترولر بيرجّع
`{ ai: {...} }` للملخّص و`{ answer }` للسؤال.

**الحل:** قراءة `data.ai` و`data.answer`. (تعديل فرونت فقط — مفيش تغيير باك.)

**الملف:** `Frontend/src/features/medical-ai/api.ts`.
