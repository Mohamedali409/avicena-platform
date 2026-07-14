# Batch 07 — Medical AI Panel  ⭐⭐ (أهم شاشة في المشروع)

**session واحد مخصّص لشاشة واحدة.** دي الميزة اللي بتميّز Avicena — خُدي وقتك فيها.
الشاشة: Doctor chat room + Medical AI assistant panel

> ابدئي بـ reference من شاشة الشات في Batch 05 عشان الجزء الشمال يبقى متسق.

---

## 🎨 Design System Prompt
```
Avicena doctor consultation screen. Arabic, RTL. Teal #0e7490, white surfaces, #f8fafc bg,
rounded-xl, Tajawal font. Trustworthy, clinical, calm. Chat bubbles: mine right teal, patient left gray.
```

---

### الشاشة — Chat + AI panel  · chat + `GET /api/medical-ai/summary/:userId` + `POST /api/medical-ai/ask`
```
[Design System] +
Doctor consultation screen split into two panels.

LEFT panel (60%): real-time chat with the patient — message bubbles, typing indicator,
message input, and a video-call button in the header.

RIGHT panel (40%): "مساعد الذكاء الطبي" AI assistant.
  - Top: an auto-generated patient summary card (عدد التقارير + ملخص الحالة).
  - Middle: a Q&A chat where the doctor types questions about the patient's history.
    Each AI answer shows a source badge like "من التقارير — 15/01/2026" and cites the
    report section it came from.
  - Suggested-question chips above the input: "الأدوية السابقة", "الحساسية الدوائية",
    "التشخيصات السابقة".
  - A permanent disclaimer pinned at the bottom:
    "معلومات مساعدة من تقارير المريض فقط — ليست تشخيصاً نهائياً".
  - An "unavailable" answer state styled distinctly (neutral gray, info icon) for when the
    reports don't contain the answer.
```

### variation مطلوبة — Empty / no-records state
```
[Design System] +
Same screen but the AI panel shows an empty state: "لا توجد تقارير سابقة لهذا المريض"
with a subtle illustration, when the patient has no indexed reports yet.
```

---
**ملاحظة أمان (مطبّقة في الباك اند):** الـ AI بيجاوب **من تقارير المريض ده بس**، ومابيخترعش معلومات، ولازم الدكتور يكون له علاقة فعلية بالمريض. الـ UI لازم يوضّح ده (المصدر + التاريخ + الـ disclaimer).

**المكان في الكود:** `src/app/(doctor)/doctor/chat` · `src/features/medical-ai/api.ts`
