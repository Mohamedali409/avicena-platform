# Batch 06 — Doctor Core  ⭐

**session واحد.** شغل الدكتور اليومي. داشبورد بـ sidebar يمين (RTL).
الشاشات: Dashboard · Profile+schedule · Appointments · Reports list · Report editor · Patient search · Patient detail · Consultations · Create consultation · Slots

> batch كبير — لو تقل عليكِ، قسّميه لجلستين بس ابدئي التانية بـ reference من الأولى.

---

## 🎨 Design System Prompt
```
Avicena doctor workspace. Arabic, RTL (right sidebar). Teal #0e7490, white cards,
#f8fafc bg, rounded-xl, Tajawal font. Sidebar nav: لوحة التحكم، المواعيد، المرضى،
التقارير، الاستشارات، المحادثات + مساعد AI. Top bar: search, notifications, avatar.
```

---

### شاشة 1 — Dashboard  · `GET /api/doctor/dashboard`
```
[Design System] +
Doctor dashboard. KPI cards: مواعيد اليوم، إجمالي المرضى، الأرباح، طلبات المحادثة المعلّقة.
An availability toggle switch. A today's-schedule timeline and a pending chat-requests preview.
```

### شاشة 2 — Profile + availability + schedule  · `GET/PUT /api/doctor/profile`
```
[Design System] +
Doctor profile settings. Sections: personal (name, phone, address, about, image),
fees (كشف + استشارة), availability toggle, and a working-window editor
(from hour, to hour, booking period in minutes). Save button.
```

### شاشة 3 — Appointments  · `/api/doctor/appointments` (+complete/cancel)
```
[Design System] +
Doctor appointments. Tabs: اليوم / القادمة / المكتملة / الملغاة. Table: patient, date,
time, amount, status; row actions: إكمال، إلغاء، كتابة تقرير، بدء محادثة.
```

### شاشة 4 — Reports list  · `GET /api/doctor/reports`
```
[Design System] +
Doctor reports list. Table: patient, date, diagnosis preview, actions (عرض، تعديل، حذف).
Search + date filter. "تقرير جديد" button.
```

### شاشة 5 — Report editor  · `POST/PUT/DELETE /api/doctor/reports`
```
[Design System] +
Medical report editor form. Linked appointment info at top. Fields: الشكوى، الفحص،
التشخيص (textareas), a dynamic treatment table (add/remove rows: الدواء، الجرعة، المدة),
الملاحظات, and a next-visit date picker. حفظ / حذف / إلغاء buttons.
```

### شاشة 6 — Patient search  · `POST /api/doctor/search`
```
[Design System] +
Patient search screen. A prominent search box (name/email). Results list with patient
avatar, name, last visit, and "عرض الملف" button.
```

### شاشة 7 — Patient detail  · `/patient-stats` + `/reports/patient`
```
[Design System] +
Patient detail page (doctor view). Header: patient info + key stats (زيارات، تقارير،
آخر تشخيص). Tabs: التقارير (this patient's reports), الإحصائيات, المحادثة.
A prominent "افتح مساعد الذكاء الطبي" button.
```

### شاشة 8 — Consultations  · `GET /api/doctor/consultations`
```
[Design System] +
Doctor consultations. Table: patient, day, time, amount, status. Actions: إكمال، إلغاء،
بدء مكالمة فيديو. "استشارة جديدة" button.
```

### شاشة 9 — Create consultation  · `POST /api/doctor/consultations`
```
[Design System] +
Create consultation form. Select patient + linked appointment, consultation day picker,
amount field, notes textarea. "إنشاء الاستشارة" button.
```

### شاشة 10 — Slots management  · `DELETE /api/doctor/slots`
```
[Design System] +
Doctor slots management. A weekly calendar showing booked slots and a
"مسح كل المواعيد المحجوزة" danger button with a confirmation dialog.
```

---
**المكان في الكود:** `src/app/(doctor)/doctor/*`
