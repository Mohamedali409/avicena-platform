# Avicena — Google Stitch Batches

كل ملف هنا = **batch واحد** تفتحيه في **session واحد على Stitch** عشان الاستايل يفضل ثابت.
صمّمي شاشة شاشة جوه نفس الـ session، ومتقفليش الـ session قبل ما تخلّصي الـ batch.

## الترتيب المقترح للتنفيذ
1. **01-foundation-auth** ← ابدئي بيه (بيثبّت الهوية البصرية كلها)
2. 02-public
3. **03-patient-core**
4. 04-patient-records
5. **05-chat-realtime**
6. **06-doctor-core**
7. **07-ai-panel** ⭐ (أهم شاشة)
8. 08-admin
9. 09-lab

> النجمة = أساسي للـ MVP. لو مستعجلة: اعملي 01 → 03 → 06 → 07 الأول.

## قاعدة الاتساق بين الـ batches (مهمة)
لما تبدئي batch جديد (session جديد)، Stitch مش فاكر اللي فات. عشان كده:
1. الصقي **الـ Design System Prompt** (موجود في أول كل ملف).
2. زوّدي الجملة دي: *"match the exact same style, colors, spacing and components as my previous Avicena screens"*.
3. لو Stitch بيسمح برفع صورة — ارفعي **screenshot** لشاشة خلصتيها قبل كده كـ reference.

## بعد التصميم
كل شاشة ليها مكان جاهز في `../src/app/` (route groups). صدّري الكود/Figma من Stitch،
وبعدين نحوّله React ونربطه بـ `../src/features/*/api.ts`.

## مرجع كامل
الجرد الكامل لكل الشاشات + الـ endpoints في: [../STITCH-PROMPTS.md](../STITCH-PROMPTS.md)
