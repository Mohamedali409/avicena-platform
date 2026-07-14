# Batch 05 — Chat + Realtime  ⭐

**session واحد.** الشاشات المشتركة بين المريض والدكتور (real-time). صمّميها مرة وتُستخدم للطرفين.
الشاشات: Conversations list · Chat room · Video call · Incoming call modal · Notifications · Bell dropdown

> ملاحظة: شاشة شات الدكتور بالـ AI panel في **Batch 07** لوحدها — دي النسخة العادية.

---

## 🎨 Design System Prompt
```
Avicena messaging & realtime UI. Arabic, RTL. Teal #0e7490, white surfaces, #f8fafc bg,
rounded-xl, Tajawal font. Chat bubbles: mine right-aligned teal, others left gray.
```

---

### شاشة 1 — Conversations list  · `GET /api/chat/conversations`
```
[Design System] +
Chat conversations list. Left column: conversations with avatar, name, last message,
time, and unread badge. Selecting one opens the room on the right (two-pane layout).
```

### شاشة 2 — Chat room  · `GET /api/chat/room/:roomId` + socket
```
[Design System] +
Real-time chat room. Header: participant name, avatar, online status, video-call button.
Scrollable message bubbles with read receipts and a typing indicator. Message input with
send button. Load older messages on scroll-up (pagination).
```

### شاشة 3 — Send chat request (modal, patient)  · `POST /api/chat/request`
```
[Design System] +
"طلب محادثة" modal. Doctor summary at top, a textarea for the initial message
(max 500 chars with a live counter), and "إرسال الطلب" button. Note: the doctor must accept first.
```

### شاشة 4 — Video call (live)  · socket WebRTC
```
[Design System] +
Video call screen. Full-screen remote video, small self-view PiP in a corner,
control bar: mute, camera toggle, end call (red), chat toggle. Caller name + call timer at top.
```

### شاشة 5 — Incoming call modal  · socket
```
[Design System] +
Incoming video call modal overlay. Caller avatar with a pulsing ring, caller name,
"مكالمة فيديو واردة", and two large buttons: رفض (red) and قبول (green).
```

### شاشة 6 — Notifications  · `GET /api/notifications`
```
[Design System] +
Notifications page. Filter chips by type (موعد، استشارة، تقرير، محادثة، دفع، نظام).
List rows with a per-type icon, title, message, time, and unread dot.
"تعليم الكل كمقروء" button.
```

### شاشة 7 — Notification bell dropdown  · `GET /api/notifications/unread`
```
[Design System] +
A notifications dropdown opening from the top-bar bell. Header with unread count and
"تعليم الكل كمقروء". Scrollable recent list (icon, title, time, unread dot).
"عرض الكل" link at the bottom.
```

---
**المكان في الكود:** `src/app/(patient)/patient/chat` · `src/features/{chat,notifications,video}`
