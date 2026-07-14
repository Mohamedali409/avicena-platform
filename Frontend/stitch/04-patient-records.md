# Batch 04 — Patient Records & Billing

**session واحد.** عرض بيانات المريض (تقارير/استشارات) + الاشتراك.
الشاشات: Reports list · Report detail (+PDF) · Consultations list · Consultation detail · Subscriptions

> نفس داشبورد المريض (sidebar يمين). ابدئي بـ reference من Batch 03.

---

## 🎨 Design System Prompt
```
Avicena patient dashboard. Arabic, RTL (right sidebar). Teal #0e7490, white cards,
#f8fafc bg, rounded-xl, Tajawal font. Same sidebar and top bar as previous patient screens.
```

---

### شاشة 1 — Reports list  · `GET /api/user/reports`
```
[Design System] +
My medical reports list. Rows/cards: doctor name, date, diagnosis preview, and actions
(عرض، تحميل PDF). Date filter. Empty state when none.
```

### شاشة 2 — Report detail (+PDF)  · `GET /api/report/:id`
```
[Design System] +
Medical report detail styled like a clinical document. Header: patient + doctor + date.
Sections: الشكوى، الفحص، التشخيص, a treatment table (الدواء، الجرعة، المدة), الملاحظات,
الزيارة القادمة. "تحميل PDF" and "طباعة" buttons at the top.
```

### شاشة 3 — Consultations list  · `GET /api/user/consultations`
```
[Design System] +
My consultations page. Consultation cards: doctor, day, time, amount,
status (نشطة/مكتملة/ملغاة). Actions: تعديل الموعد، إلغاء، انضمام (if video enabled).
```

### شاشة 4 — Consultation detail / reschedule  · `/consultations/single|time|cancel`
```
[Design System] +
Consultation detail modal. Shows the linked appointment, doctor, day, time, notes.
A time picker to reschedule (تعديل الموعد) and a cancel button with a confirmation dialog.
```

### شاشة 5 — Subscription / plans  · `/api/subscriptions`
```
[Design System] +
Subscription page. Three plan cards: Free, Basic, Premium — each with price and a
feature list (استشارات/شهر، مكالمة فيديو، محادثة، دعم أولوية). Current plan highlighted.
"اشترك" / "إلغاء الاشتراك" buttons. Below: active subscription details (status, expiry date).
```

---
**المكان في الكود:** `src/app/(patient)/patient/{reports,consultations,subscriptions}`
