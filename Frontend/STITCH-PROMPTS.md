# Avicena — Complete UI Screen Inventory & Google Stitch Prompts

> 🗂️ **للتنفيذ على Stitch:** الملف ده هو **المرجع الكامل** (كل الشاشات + الـ endpoints).
> بس متفتحيش كله مرة واحدة على Stitch — استخدمي الـ **batches** المقسّمة في مجلد
> [`stitch/`](stitch/README.md): 9 ملفات، كل ملف = session واحد بشكل متسق.

هدف الملف: **كل شاشة** في الفرونت مربوطة بالفيتشر/الـ endpoint بتاعها في الباك اند — عشان الفرونت يطلع كامل من أول مرة من غير ما تضيع أي ميزة.

- **الطريقة:** انسخي "الـ Design System Prompt" مرة، وحطيه في أول كل prompt، بعدين لزّقي prompt الشاشة.
- **صمّمي شاشة شاشة** (مش الكل مرة واحدة) — النتيجة أدق.
- عمود "Endpoint" بيقولك الشاشة دي بتتكلم مع أنهي API.

---

## 🎨 0. Design System Prompt (ثابت — في أول كل prompt)

```
A healthcare telemedicine web dashboard called "Avicena".
Arabic language, RTL layout (sidebar on the RIGHT). Clean clinical aesthetic:
primary teal #0e7490, white surfaces, light gray #f8fafc background, rounded-xl cards,
soft shadows, Tajawal/Cairo font, generous spacing, accessible contrast.
Status colors: green=success/active, amber=pending, red=cancelled/danger.
Consistent top bar with: search, notifications bell (with unread badge), and user avatar menu.
```

---

## 🗺️ جرد الشاشات الكامل (Screen Inventory)

| # | الشاشة | الرول | Endpoint / Feature |
|---|--------|-------|--------------------|
| **مشتركة / عامة** |
| 1 | Landing (الصفحة الرئيسية) | Public | — |
| 2 | Doctors listing | Public | `GET /api/doctor/list` |
| 3 | Doctor detail | Public | `GET /api/doctor/list` (single) |
| 4 | Labs listing | Public | `GET /api/lab` |
| 5 | Lab detail | Public | `GET /api/lab/:id` |
| 6 | Login (موحّد للأربع أدوار) | All | `/api/auth/(login|doctor/login|admin/login|lab/login)` |
| 7 | Register | Patient | `POST /api/auth/register` |
| 8 | Forgot / Reset password | Patient | (auth stubs — اختياري) |
| **المريض (Patient)** |
| 9 | Patient dashboard | Patient | `GET /api/user/stats` |
| 10 | Profile view/edit | Patient | `GET/PUT /api/user/profile` |
| 11 | Book appointment | Patient | `POST /api/user/appointments` |
| 12 | My appointments (paginated) | Patient | `GET /api/user/appointments` + `/cancel` |
| 13 | My reports (list) | Patient | `GET /api/user/reports` |
| 14 | Report detail (+ PDF) | Patient | `GET /api/report/:id` |
| 15 | Consultations list | Patient | `GET /api/user/consultations` |
| 16 | Consultation detail / reschedule | Patient | `/consultations/single|time|cancel` |
| 17 | Chat — conversations list | Patient | `GET /api/chat/conversations` |
| 18 | Chat — request a doctor (modal) | Patient | `POST /api/chat/request` |
| 19 | Chat — my requests status | Patient | `GET /api/chat/my-requests` |
| 20 | Chat room (messages) | Patient | `GET /api/chat/room/:roomId` + socket |
| 21 | Notifications | Patient | `GET /api/notifications` |
| 22 | Subscription / plans | Patient | `/api/subscriptions` |
| 23 | Video call (live) | Patient | socket WebRTC |
| 24 | Call history | Patient | `GET /api/video-call/history` |
| **الطبيب (Doctor)** |
| 25 | Doctor dashboard | Doctor | `GET /api/doctor/dashboard` |
| 26 | Doctor profile + availability + schedule | Doctor | `GET/PUT /api/doctor/profile` |
| 27 | Doctor appointments | Doctor | `/api/doctor/appointments` (+complete/cancel) |
| 28 | Reports list | Doctor | `GET /api/doctor/reports` |
| 29 | Report editor (create/edit/delete) | Doctor | `POST/PUT/DELETE /api/doctor/reports` |
| 30 | Patient search | Doctor | `POST /api/doctor/search` |
| 31 | Patient detail (stats + reports) | Doctor | `/patient-stats` + `/reports/patient` |
| 32 | Consultations list | Doctor | `GET /api/doctor/consultations` |
| 33 | Create consultation | Doctor | `POST /api/doctor/consultations` |
| 34 | Chat requests (pending/accept/reject) | Doctor | `/api/chat/doctor/requests(/accept|/reject)` |
| 35 | Chat room + 🤖 AI panel | Doctor | chat + `/api/medical-ai/summary` & `/ask` |
| 36 | Notifications | Doctor | `GET /api/notifications` |
| 37 | Video call (live) + history | Doctor | socket + `/api/video-call/history` |
| 38 | Slots management | Doctor | `DELETE /api/doctor/slots` |
| **الأدمن (Admin)** |
| 39 | Admin dashboard | Admin | `GET /api/admin/dashboard` |
| 40 | Doctors management | Admin | `GET/DELETE /api/admin/doctors` + availability |
| 41 | Add doctor (form + image) | Admin | `POST /api/admin/doctors` |
| 42 | Users management (search/toggle) | Admin | `/api/admin/users(/search|/status)` |
| 43 | Appointments management | Admin | `/api/admin/appointment(/cancel)` |
| 44 | Consultations management | Admin | `/api/admin/consultations(/user)` + cancel |
| 45 | Reports management | Admin | `/api/admin/reports` (+edit/delete/user) |
| 46 | Labs management + add lab | Admin | `POST /api/lab` |
| **المعمل (Lab)** |
| 47 | Lab profile edit | Lab | `GET/PUT /api/lab/me/profile` |
| 48 | Tests catalog | Lab | `PUT /api/lab/me/profile` (tests[]) |
| **مكوّنات مشتركة (Shared)** |
| 49 | Notification bell dropdown | All | `/api/notifications/unread` |
| 50 | Incoming call modal | Patient/Doctor | socket |
| 51 | Empty / loading / error states | All | — |

---

## 🧩 الـ Prompts

> ذكّرك: كل prompt يبدأ بالـ **Design System Prompt** فوق. هنا هكتب الجزء الخاص بالشاشة بس.

### مشتركة / عامة

**1. Landing**
```
Public landing page for Avicena telemedicine. Hero with headline "استشارتك الطبية عن بُعد"،
a search bar for doctors by specialization, primary "احجز الآن" button, 3 feature cards
(حجز فوري، استشارة بالفيديو، ملف طبي ذكي), a doctors preview row, footer.
```

**2. Doctors listing**
```
Doctors listing page. Filter sidebar (specialization, availability, fee range).
Responsive grid of doctor cards: photo, name, specialization, degree, experience,
fee, availability badge, and "احجز موعد" button. Pagination at bottom.
```

**3. Doctor detail**
```
Single doctor profile page. Header with photo, name, specialization, rating, fees,
availability. Tabs: About, Working hours, Book. Right column: booking widget with
date picker + time slots. "احجز موعد" primary CTA.
```

**4. Labs listing**
```
Medical labs listing. Grid of lab cards: name, address, working hours, verified badge,
number of available tests, and "عرض التحاليل" button. Search by lab name.
```

**5. Lab detail**
```
Single lab page. Lab header (name, address, phone, working hours, certifications).
A searchable tests table: Test name, Price, Duration, Description.
```

**6. Login (موحّد)**
```
Centered login card. Role selector segmented control (مريض / دكتور / أدمن / معمل),
email + password fields, "دخول" teal button, "نسيت كلمة المرور؟" link, and
"إنشاء حساب" link. Soft gradient background.
```

**7. Register (patient)**
```
Patient registration card: full name, email, password, confirm password,
"إنشاء حساب" button, terms checkbox, and a link back to login.
```

**8. Forgot / Reset password**
```
Two-step password reset: step 1 email input to receive a link; step 2 new password
+ confirm. Simple centered cards with success confirmation state.
```

### المريض (Patient)

**9. Patient dashboard**
```
Patient dashboard. 4 stat cards: المواعيد القادمة، الاستشارات النشطة، عدد التقارير،
خطة الاشتراك. A "احجز موعد" primary button. Below: an upcoming-appointments table
(Doctor, Specialization, Date, Time, Status, Cancel) and a recent-reports list.
```

**10. Patient profile**
```
Patient profile page. Left: avatar with upload button. Right: form with name, phone,
gender, date of birth, nationality, national ID, and address (line1, line2).
Save button. Show read-only email.
```

**11. Book appointment**
```
Book appointment flow. Selected doctor summary card (photo, name, specialization, fee).
A calendar month picker; a grid of time slots (booked slots disabled/gray).
Right summary panel: date, time, fee → "تأكيد الحجز" button.
```

**12. My appointments**
```
My appointments page. Tabs: القادمة / المكتملة / الملغاة. A paginated table:
Doctor, Date, Time, Amount, Status badge, Actions (Cancel, View report if completed).
Pagination controls. Empty state illustration when none.
```

**13. My reports (list)**
```
My medical reports list. Cards or table rows: doctor name, date, diagnosis preview,
and actions (View, Download PDF). Filter by date. Empty state.
```

**14. Report detail (+PDF)**
```
Medical report detail page styled like a clinical document. Header: patient + doctor +
date. Sections: الشكوى، الفحص، التشخيص، a treatment table (Medication, Dosage, Duration),
Notes, Next visit. "تحميل PDF" and "طباعة" buttons at top.
```

**15. Consultations list**
```
My consultations page. List of consultation cards: doctor, day, time, amount,
status (نشطة/مكتملة/ملغاة). Actions: reschedule time, cancel, join (if video enabled).
```

**16. Consultation detail / reschedule**
```
Consultation detail modal/page. Shows linked appointment, doctor, day, time, notes.
A time picker to reschedule (تعديل الموعد) and a cancel button with confirmation dialog.
```

**17. Chat — conversations list**
```
Chat conversations list (patient). Left column: list of doctor conversations with
avatar, name, last message, time, unread badge. Selecting one opens the room on the right.
```

**18. Chat — request a doctor (modal)**
```
"طلب محادثة" modal. Doctor summary at top, a textarea for the initial message
(max 500 chars with counter), and a "إرسال الطلب" button. Note that the doctor must accept.
```

**19. Chat — my requests status**
```
My chat requests page. List with doctor, initial message, status badge
(pending=amber, accepted=green, rejected=red + reason). Timestamps.
```

**20. Chat room**
```
Real-time chat room. Header: doctor name, avatar, online status, video-call button.
Scrollable message bubbles (mine right-aligned teal, theirs left gray), read receipts,
typing indicator, and a message input with send button. Paginated older messages on scroll-up.
```

**21. Notifications**
```
Notifications page. Filter chips by type (appointment, consultation, report, chat, payment, system).
List rows with icon per type, title, message, time, unread dot. "تعليم الكل كمقروء" button.
```

**22. Subscription / plans**
```
Subscription page. Three plan cards: Free, Basic, Premium — each with price and feature list
(consultations/month, video call, chat, priority support). Current plan highlighted.
"اشترك" / "إلغاء الاشتراك" buttons. Below: active subscription details (status, expiry).
```

**23. Video call (live)**
```
Video call screen. Full-screen remote video, small self-view PiP (bottom corner),
control bar: mute, camera toggle, end call (red), chat toggle. Caller name + timer at top.
```

**24. Call history**
```
Call history list. Rows: participant name, avatar, direction (incoming/outgoing),
type (video/audio), status (ended/missed/rejected), duration, date/time.
```

### الطبيب (Doctor)

**25. Doctor dashboard**
```
Doctor workspace dashboard. KPI cards: مواعيد اليوم، إجمالي المرضى، الأرباح،
طلبات المحادثة المعلّقة. An availability toggle switch. A today's schedule timeline
and a pending chat-requests preview list.
```

**26. Doctor profile + availability + schedule**
```
Doctor profile settings. Sections: personal (name, phone, address, about, image),
fees (كشف + استشارة), availability toggle, and working window editor
(from hour, to hour, booking period in minutes). Save button.
```

**27. Doctor appointments**
```
Doctor appointments management. Tabs: اليوم / القادمة / المكتملة / الملغاة.
Table: patient name, date, time, amount, status; row actions: إكمال، إلغاء،
كتابة تقرير، بدء محادثة.
```

**28. Reports list (doctor)**
```
Doctor's reports list. Table: patient, date, diagnosis preview, actions (view, edit, delete).
Search + date filter. "تقرير جديد" button.
```

**29. Report editor**
```
Medical report editor form. Linked appointment info at top. Fields: الشكوى، الفحص،
التشخيص (textareas), a dynamic treatment table (add/remove rows: Medication, Dosage, Duration),
Notes, and Next visit date picker. Save / Delete / Cancel buttons.
```

**30. Patient search (doctor)**
```
Patient search screen. A prominent search box (name/email). Results list with patient
avatar, name, last visit, and "عرض الملف" button.
```

**31. Patient detail (doctor)**
```
Patient detail page (doctor view). Header: patient info + key stats (visits, reports,
last diagnosis). Tabs: التقارير (list of this patient's reports), الإحصائيات, المحادثة.
Prominent "افتح مساعد الذكاء الطبي" button.
```

**32. Consultations list (doctor)**
```
Doctor consultations management. List/table: patient, day, time, amount, status.
Actions: إكمال، إلغاء، بدء مكالمة فيديو. "استشارة جديدة" button.
```

**33. Create consultation**
```
Create consultation form. Select patient + linked appointment, consultation day picker,
amount field, and notes textarea. "إنشاء الاستشارة" button.
```

**34. Chat requests (doctor)**
```
Doctor incoming chat requests. Filter by status. Cards: patient name, avatar, initial
message preview, time. Two actions: قبول (green) and رفض (red — opens a reason input).
```

**35. ⭐ Chat room + AI panel (أهم شاشة)**
```
Doctor consultation screen split into two panels.
LEFT (60%): real-time chat with the patient — message bubbles, typing indicator,
input box, video-call button.
RIGHT (40%): "مساعد الذكاء الطبي" panel. Top: an auto-generated patient summary card.
Below: a Q&A chat where the doctor types questions about the patient's medical history;
each AI answer shows a source badge ("من التقارير — 15/01/2026") and citation of the report section.
A permanent disclaimer at bottom: "معلومات مساعدة من تقارير المريض — ليست تشخيصاً نهائياً".
Suggested-question chips: "الأدوية السابقة", "الحساسية الدوائية", "التشخيصات السابقة".
```

**36. Notifications (doctor)** — نفس prompt الإشعارات (#21) بس أنواعها: appointment, consultation, report, chat_request.

**37. Video call + history (doctor)** — نفس #23 و #24.

**38. Slots management**
```
Doctor slots management panel. A weekly calendar view showing booked slots.
A "مسح كل المواعيد المحجوزة" danger button with a confirmation dialog.
```

### الأدمن (Admin)

**39. Admin dashboard**
```
Admin console dashboard. Overview stat cards: إجمالي الأطباء، المرضى، المواعيد، الإيرادات.
A bar chart of monthly appointments, a line chart of revenue, and a recent-activity feed.
```

**40. Doctors management**
```
Admin doctors table. Columns: photo, name, specialization, fees, availability toggle,
status; actions: view, remove (with confirm). "إضافة طبيب" primary button + search.
```

**41. Add doctor (form + image)**
```
Add doctor form (admin). Image upload, name, email, password, specialization, degree,
experience, about, fees, consultation fees, phone, address (line1/line2),
working window (from/to/booking period). "إضافة" button.
```

**42. Users management**
```
Admin users table. Columns: name, email, phone, status (active/inactive), joined date;
actions: toggle active/deactivate. Search box by name/email. Pagination.
```

**43. Appointments management (admin)**
```
Admin appointments table (all users). Columns: patient, doctor, date, time, amount,
payment status, status; action: cancel. Filters by status and date range.
```

**44. Consultations management (admin)**
```
Admin consultations table (all). Columns: patient, doctor, day, time, amount, status;
action: cancel. Filter by user. "عرض حسب المستخدم" lookup.
```

**45. Reports management (admin)**
```
Admin reports table. Columns: patient, doctor, date, diagnosis preview;
actions: view, edit, delete. Filter by user.
```

**46. Labs management + add lab**
```
Admin labs page. Table of labs (name, email, phone, verified, active). "إضافة معمل" button
opening a form: name, email, password, phone, address, and an initial tests list (name + price rows).
```

### المعمل (Lab)

**47. Lab profile edit**
```
Lab profile settings. Form: lab name, phone, address (line1, line2, city),
working hours (from/to), logo upload, certifications list. Save button.
```

**48. Tests catalog**
```
Lab tests catalog manager. Editable table of tests: name, price, duration, description,
with add/edit/delete rows and a save button.
```

### مكوّنات مشتركة (Shared)

**49. Notification bell dropdown**
```
A notifications dropdown (opens from the top-bar bell). Header with unread count and
"تعليم الكل كمقروء". A scrollable list of recent notifications with type icon, title,
time, and unread dot. "عرض الكل" link at bottom.
```

**50. Incoming call modal**
```
Incoming video call modal overlay. Caller avatar (pulsing ring), caller name,
"مكالمة فيديو واردة", and two large buttons: رفض (red) and قبول (green).
```

**51. Empty / loading / error states**
```
A set of reusable states for the dashboard: empty state (friendly illustration + message +
CTA), loading skeletons for tables and cards, and an error state with retry button.
```

---

## ✅ Checklist — غطّينا كل فيتشر في الباك اند؟

- [x] Auth (register, login ×4 roles, refresh, logout, forgot/reset)
- [x] Patient: profile, stats, appointments, reports, consultations
- [x] Doctor: dashboard, profile/schedule, appointments, reports CRUD, consultations, patient search/stats, slots
- [x] Admin: dashboard, doctors, users, appointments, consultations, reports, labs
- [x] Labs: public listing/detail, profile, tests catalog
- [x] Chat: request flow (send/accept/reject), rooms, conversations, unread
- [x] Medical AI (RAG): summary + grounded Q&A panel
- [x] Notifications: feed, unread, mark read
- [x] Subscriptions: plans, subscribe, active, cancel
- [x] Video call: live + history + incoming modal
- [x] Shared: bell dropdown, empty/loading/error states

كل شاشة من دول ليها مكان جاهز في `src/app/` (route groups) — بعد ما تصمّميها على Stitch، الكود يتحوّل لـ React ويترابط بـ `features/*/api.ts`.
