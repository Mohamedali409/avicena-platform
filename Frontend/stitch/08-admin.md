# Batch 08 — Admin Console

**session واحد.** كلها dashboards + tables + forms — متجانسة جداً فسهلة.
الشاشات: Dashboard · Doctors mgmt · Add doctor · Users · Appointments · Consultations · Reports · Labs mgmt + Add lab

---

## 🎨 Design System Prompt
```
Avicena admin console. Arabic, RTL (right sidebar). Teal #0e7490, white cards, #f8fafc bg,
rounded-xl, Tajawal font. Sidebar nav: لوحة التحكم، الأطباء، المستخدمون، المواعيد،
الاستشارات، التقارير، المعامل. Data-dense but clean tables with row actions.
```

---

### شاشة 1 — Dashboard  · `GET /api/admin/dashboard`
```
[Design System] +
Admin dashboard. Overview stat cards: إجمالي الأطباء، المرضى، المواعيد، الإيرادات.
A bar chart of monthly appointments, a revenue line chart, and a recent-activity feed.
```

### شاشة 2 — Doctors management  · `GET/DELETE /api/admin/doctors` + availability
```
[Design System] +
Admin doctors table. Columns: photo, name, specialization, fees, availability toggle, status;
actions: عرض، حذف (with confirm). "إضافة طبيب" primary button + search.
```

### شاشة 3 — Add doctor  · `POST /api/admin/doctors`
```
[Design System] +
Add doctor form (admin). Image upload, name, email, password, specialization, degree,
experience, about, fees, consultation fees, phone, address (line1/line2), and a working
window (from/to/booking period). "إضافة" button.
```

### شاشة 4 — Users management  · `/api/admin/users(/search|/status)`
```
[Design System] +
Admin users table. Columns: name, email, phone, status (active/inactive), joined date;
action: toggle active/deactivate. Search box + pagination.
```

### شاشة 5 — Appointments management  · `/api/admin/appointment(/cancel)`
```
[Design System] +
Admin appointments table (all users). Columns: patient, doctor, date, time, amount,
payment status, status; action: cancel. Filters by status and date range.
```

### شاشة 6 — Consultations management  · `/api/admin/consultations(/user)` + cancel
```
[Design System] +
Admin consultations table (all). Columns: patient, doctor, day, time, amount, status;
action: cancel. A "عرض حسب المستخدم" lookup filter.
```

### شاشة 7 — Reports management  · `/api/admin/reports` (+edit/delete/user)
```
[Design System] +
Admin reports table. Columns: patient, doctor, date, diagnosis preview;
actions: عرض، تعديل، حذف. Filter by user.
```

### شاشة 8 — Labs management + Add lab  · `POST /api/lab`
```
[Design System] +
Admin labs page. Table of labs (name, email, phone, verified, active). "إضافة معمل" button
opening a form: name, email, password, phone, address, and an initial tests list
(rows of اسم + سعر).
```

---
**المكان في الكود:** `src/app/(admin)/admin/*`
