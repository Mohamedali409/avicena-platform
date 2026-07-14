# Batch 09 — Lab Portal

**session واحد.** أصغر batch — بورتال المعمل.
الشاشات: Lab profile edit · Tests catalog

---

## 🎨 Design System Prompt
```
Avicena lab portal. Arabic, RTL (right sidebar). Teal #0e7490, white cards, #f8fafc bg,
rounded-xl, Tajawal font. Sidebar nav: ملف المعمل، قائمة التحاليل. Top bar with avatar menu.
```

---

### شاشة 1 — Lab profile edit  · `GET/PUT /api/lab/me/profile`
```
[Design System] +
Lab profile settings. Form: lab name, phone, address (line1, line2, city),
working hours (from/to), logo upload, and a certifications list. Save button.
```

### شاشة 2 — Tests catalog  · `PUT /api/lab/me/profile` (tests[])
```
[Design System] +
Lab tests catalog manager. An editable table of tests: اسم التحليل، السعر، المدة، الوصف,
with add/edit/delete rows and a save button.
```

---
**المكان في الكود:** `src/app/(lab)/lab/{profile,tests}`
