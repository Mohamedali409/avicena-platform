# Batch 02 — Public Pages

**session واحد.** الصفحات العامة اللي أي حد يشوفها من غير تسجيل دخول.
الشاشات: Doctors listing · Doctor detail · Labs listing · Lab detail

> ابدئي الـ session بـ: *"match the exact same style, colors and spacing as my previous Avicena screens"* + ارفعي screenshot من Batch 01.

---

## 🎨 Design System Prompt
```
A healthcare telemedicine web app "Avicena". Arabic, RTL. Primary teal #0e7490,
white cards, #f8fafc background, rounded-xl, soft shadows, Tajawal font.
Top bar with logo, doctor search, and login/register buttons.
```

---

### شاشة 1 — Doctors listing  · `GET /api/doctor/list`
```
[Design System] +
Doctors listing page. Left filter sidebar (specialization, availability, fee range).
Responsive grid of doctor cards: photo, name, specialization, degree, experience,
fee, availability badge, and "احجز موعد" button. Pagination at the bottom.
```

### شاشة 2 — Doctor detail  · `GET /api/doctor/list` (single)
```
[Design System] +
Single doctor profile page. Header with photo, name, specialization, fees, availability.
Tabs: نبذة، مواعيد العمل، الحجز. Right column: a booking widget with a date picker
and time-slot grid. "احجز موعد" primary CTA.
```

### شاشة 3 — Labs listing  · `GET /api/lab`
```
[Design System] +
Medical labs listing. Grid of lab cards: name, address, working hours, verified badge,
number of available tests, and "عرض التحاليل" button. Search by lab name.
```

### شاشة 4 — Lab detail  · `GET /api/lab/:id`
```
[Design System] +
Single lab page. Header (name, address, phone, working hours, certifications).
A searchable tests table: اسم التحليل، السعر، المدة، الوصف.
```

---
**المكان في الكود:** `src/app/(public)/doctors` · `src/app/(public)/labs`
