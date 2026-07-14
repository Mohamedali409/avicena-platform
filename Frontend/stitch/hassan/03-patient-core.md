# Batch 03 — Patient Core  ⭐

**session واحد.** قلب رحلة المريض. من هنا وطالع كل الشاشات جوه داشبورد بـ **sidebar يمين** (RTL).
الشاشات: Patient dashboard · Book appointment · My appointments · Profile

> ابدئي بـ: *"match the exact same style as my previous Avicena screens"* + screenshot من Batch 01.

---

## 🎨 Design System Prompt
```
Avicena patient dashboard. Arabic, RTL (sidebar on the RIGHT). Primary teal #0e7490,
white cards, #f8fafc background, rounded-xl, soft shadows, Tajawal font.
Persistent right sidebar nav: لوحة التحكم، مواعيدي، الاستشارات، تقاريري، المحادثات،
الاشتراك، الملف الشخصي. Top bar: search, notifications bell with unread badge, avatar menu.
```

---

### شاشة 1 — Patient dashboard  · `GET /api/user/stats`
```
[Design System] +
Patient dashboard main area. 4 stat cards: المواعيد القادمة، الاستشارات النشطة،
عدد التقارير، خطة الاشتراك. A "احجز موعد" primary button. Below: an upcoming-appointments
table (Doctor, Specialization, Date, Time, Status, Cancel) and a recent-reports list.
```

### شاشة 2 — Book appointment  · `POST /api/user/appointments`
```
[Design System] +
Book appointment flow. Selected doctor summary card (photo, name, specialization, fee).
A calendar month picker; a grid of time slots (booked slots disabled/gray).
Right summary panel: date, time, fee → "تأكيد الحجز" button.
```

### شاشة 3 — My appointments  · `GET /api/user/appointments` (+cancel)
```
[Design System] +
My appointments page. Tabs: القادمة / المكتملة / الملغاة. A paginated table:
Doctor, Date, Time, Amount, Status badge, Actions (إلغاء، عرض التقرير if completed).
Pagination controls and an empty-state illustration when none.
```

### شاشة 4 — Profile  · `GET/PUT /api/user/profile`
```
[Design System] +
Patient profile page. Left: avatar with upload button. Right: form with name, phone,
gender, date of birth, nationality, national ID, and address (line1, line2).
Email shown read-only. Save button.
```

---
**المكان في الكود:** `src/app/(patient)/patient/{dashboard,appointments,profile}`
