# Chat / Video / Booking — Frontend Foundation

> طبقة الفرونت اند الأساسية (data + logic) للشات، الفيديو كول، الحجز، والإشعارات.
> بتتكلم مع الباك اند عبر REST (axios) + Socket.io حسب العقد الموثّق في
> `Backend/CHAT_VIDEO_FIXES.md`. الـ UI (الصفحات/الكومبوننتس) بتتبني فوق الطبقة دي.
>
> Stack: Next.js 15 (App Router) · React 19 · TypeScript · Zustand · React Query · socket.io-client
> آخر تحديث: 2026-07-31

---

## 1. الملفات اللي اتبنت

```
src/lib/socket/
  socket.ts              # اتصال Socket.io واحد مشترك (cookie-auth) — اتحسّن
  events.ts              # عقد الأحداث المُوحّد (SOCKET_EVENTS) — مصدر الحقيقة

src/features/booking/
  api.ts                 # getAvailableSlots + book/list/cancel appointment

src/features/chat/
  types.ts               # ChatMessage, Conversation, ChatRequest
  api.ts                 # REST: roomId, history, conversations, unread, requests
  useChat.ts             # hook الغرفة: join/history/send/receive/typing/read

src/features/notifications/
  api.ts                 # REST: list, unread, read-all, read-one
  useNotifications.ts    # hook: unread count حيّ + آخر الإشعارات

src/features/video/
  types.ts               # CallStatus, IncomingCall, CallRecord
  api.ts                 # REST: call history / single call
  useVideoCall.ts        # hook WebRTC كامل (signaling + media + controls)
```

> **مفيش UI لسه** — دي طبقة الـ logic القابلة لإعادة الاستخدام. الصفحات جايّة بعد كده.

---

## 2. المصادقة على السوكت (مهم)

`getSocket()` بيفتح اتصال واحد مشترك بيعتمد على **الكوكيز httpOnly** (`withCredentials`).
الباك اند (بعد الإصلاح) بيقرأ `accessToken` من الكوكي — فمحتاجش تبعت أي توكن من الـ JS.
- افتح السوكت بعد الـ login (لما الكوكي تتزرع).
- عند الـ logout: `disconnectSocket()` (متعمول بالفعل في `auth.store`).

---

## 3. الفلو الكامل (Booking → Chat → Video)

```
1) المريض يفتح بروفايل الدكتور
2) getAvailableSlots(docId, date)      → يعرض السلوتس الفاضية
3) bookAppointment(docId, date, time)  → يتعمل الحجز
4) قرب الميعاد (نافذة −15/+60 دقيقة افتراضياً):
   - getRoomId(doctorId)               → roomId
   - useChat({ roomId, receiverId: doctorId, selfId })  → الشات يفتح
   - لو الوقت بره النافذة → السيرفر يرجّع chat:error (البوابة على الحجز)
5) من جوّه الشات: useVideoCall().startCall(doctorId, "doctor")  → مكالمة
```

---

## 4. أمثلة استخدام سريعة

### الحجز
```ts
import { getAvailableSlots, bookAppointment } from "@/features/booking/api";

const { available } = await getAvailableSlots(docId, "2026-08-05");
await bookAppointment(docId, "2026-08-05", available[0]); // "09:00"
```

### الشات (داخل كومبوننت غرفة)
```tsx
"use client";
import { useChat } from "@/features/chat/useChat";
import { useAuth } from "@/store/auth.store";

function ChatRoom({ roomId, doctorId }: { roomId: string; doctorId: string }) {
  const selfId = useAuth((s) => s.session?.user._id ?? null);
  const { messages, sendMessage, notifyTyping, peerTyping, loadingHistory, error } =
    useChat({ roomId, receiverId: doctorId, selfId });

  // اعرض messages، نادِ notifyTyping() في onChange، و sendMessage(text) عند الإرسال
}
```

### الفيديو كول
```tsx
"use client";
import { useVideoCall } from "@/features/video/useVideoCall";

function CallUI({ doctorId }: { doctorId: string }) {
  const call = useVideoCall();
  // call.startCall(doctorId, "doctor")     ابدأ مكالمة
  // call.incomingCall && call.acceptCall() / call.rejectCall()
  // اربط call.localStream / call.remoteStream بـ <video>.srcObject
  // call.endCall() / call.toggleMic() / call.toggleCam()
}
```

### الإشعارات (مرة واحدة عالياً — مثلاً في الهيدر)
```tsx
const { unread, latest, markAllRead } = useNotifications();
```

---

## 5. ملاحظات تقنية / قرارات

- **عقد الأحداث موحّد** في `events.ts` (`SOCKET_EVENTS`) — أي حدث في الكود بيرجع للثابت ده،
  فأي rename بيتمسك من TypeScript. مطابق لأسماء الباك اند بعد التوحيد (`call:*`).
- **الشات optimistic**: الرسالة بتتعرض فوراً كـ `pending` وبتتصالح مع `chat:message:sent`.
- **الفيديو WebRTC**: P2P بـ **STUN عام فقط**. للـ production لازم **TURN server** (شبكات الموبايل /
  symmetric NAT). الـ `offer`/`answer`/`ice` بتتبعت مباشرة لـ `targetId` (زي الباك).
  الـ ICE candidates اللي بتوصل قبل الـ remoteDescription بتتخزّن مؤقتاً وتتضاف بعدها.
- **الرد على الـ response**: شكل الباك `{ success, message, ...data }` (منشور top-level)، فالـ api
  بيقرأ المفتاح المسمّى مباشرة (`data.slots`, `data.message`, `data.roomId`...).

---

## 6. اللي لسه ناقص (UI + مؤجّلات الباك)

- **UI:** صفحة/كومبوننت غرفة الشات، شاشة المكالمة (بـ `<video>`), قائمة المحادثات،
  اختيار السلوت في صفحة الحجز، جرس الإشعارات.
- **الباك (مؤجّل):** الدفع قبل فتح الشات، الحجز الأوفلاين (تمييز `type`).
- **TURN server** لإنتاج الفيديو.
- **REST مسارات الإشعارات:** الـ api بيفترض `GET /api/notifications`, `/unread`,
  `PATCH /read-all`, `/:id/read` (متطابقة مع الراوتر الحالي).
