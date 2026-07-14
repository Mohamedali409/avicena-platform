# 6. Security Design

Avicena stores **Protected Health Information (PHI)**. Security is therefore a first-class concern across auth, data isolation, and the AI layer.

---

## 6.1 Security objectives
- Authenticate and authorize every actor by role.
- Keep each patient's clinical data (and AI-retrievable vectors) strictly compartmentalized.
- Prevent the AI assistant from fabricating or leaking information.
- Protect payment and identity data; resist common web attacks.

---

## 6.2 STRIDE threat model

| Threat | Example in Avicena | Mitigation |
|--------|--------------------|------------|
| **S**poofing | Forged/replayed JWT; impersonating a doctor via `dtoken` | Signed JWTs with expiry; refresh rotation + server-side session (Redis); role guards; secret rotation. |
| **T**ampering | Editing another patient's report/appointment; altering `amount` client-side | Server recomputes fees; ownership checks in services; input validation (zod); Mongo update guards by owner id. |
| **R**epudiation | Doctor denies editing a report; user denies a cancellation | `timestamps` on all docs; audit log for report edit/delete, cancellations, payments (recommended). |
| **I**nformation disclosure | Cross-patient PHI leak via AI; over-broad list endpoints | Qdrant filter `userId`; `password select:false`; field projection; pagination; guard-scoped queries. |
| **D**enial of service | Auth/AI endpoint flooding; huge payloads | `express-rate-limit`; body `10mb` cap; AI `max_tokens:600`; queue backpressure; message ≤500 chars. |
| **E**levation of privilege | Patient calling admin/doctor routes | Distinct guards (`auth`/`admin`/`doctor`) + role enum checks; deny-by-default routing. |

---

## 6.3 Authentication & session
- **Access token** (short-lived JWT) + **refresh token** (rotating) for patients; single `token` for doctor/admin/lab.
- Store refresh/session state in **Redis** (`session.service.js`) to allow server-side logout/invalidation.
- Passwords hashed with bcrypt; `password` never returned (`select:false`). Google users may have no password.
- **Recommendations:** unify the four header schemes behind one `Authorization: Bearer` + role claim; add token `jti` + denylist on logout; enforce password strength; add login rate-limit + lockout; support MFA for doctors/admin.

## 6.4 Authorization model
- Route-level guards map role → allowed header → allowed operations.
- **Resource ownership** must be verified in services, not just role (e.g., a doctor may only edit reports they authored; a patient may only read their own).
- Admin override paths (edit/delete any report) must be audited.

## 6.5 Input validation & sanitization
- **zod** schemas at the module boundary (`*.validation.js`) — validate types, lengths, enums (`slotDate`, `plan`, `status`).
- Reject unknown fields; coerce/whitelist before persistence.
- Sanitize free-text (chat messages, report fields, AI questions) to prevent stored XSS when rendered in the web app (escape on render; never `dangerouslySetInnerHTML`).
- Guard against **NoSQL injection**: never pass raw user objects into query filters; cast ids with Mongoose; forbid operator injection (`$gt`, `$where`).
- File uploads (multer → Cloudinary): validate mime/size, generate server-side names, strip metadata.

## 6.6 AI / prompt security (RAG boundaries)
The Medical AI is the highest-risk surface. Controls in place and required:

- **Grounding:** system prompt forbids inventing info; answers must come only from retrieved chunks; explicit "information not available" fallback.
- **Tenant isolation:** retrieval filters `must userId == patient`; a doctor can never pull another patient's vectors.
- **Least data:** top-k (5) chunks only; `chatHistory` truncated to last 6 turns; `max_tokens:600`.
- **Prompt-injection defense (to add):** treat report text as *data, not instructions*; wrap context with clear delimiters and an instruction that user/report content cannot change the rules; strip/escape control phrases; never let retrieved text trigger tool calls.
- **Output guardrails:** no prescriptions/final diagnosis; label as decision-support; log AI Q&A for audit (without exposing to other patients).
- **Access control:** AI routes are `dtoken`-only; verify the requesting doctor has a legitimate relationship (appointment/consultation/accepted chat) with the patient before answering — currently only role is checked; **add relationship check**.
- **Key hygiene:** `CEREBRAS_API_KEY` / `GEMINI_API_KEY` server-side only, never shipped to the browser.

## 6.7 Transport & platform
- Enforce HTTPS/WSS in production; HSTS via helmet.
- CORS allow-list to known web origins; credentials handling explicit.
- Secrets from env/secret manager, never committed; rotate regularly.
- Dependency scanning (npm audit / Snyk) in CI; pin versions.

## 6.8 Data protection & compliance
- Encrypt data at rest (DB/Qdrant provider) and in transit.
- **PHI retention & erasure:** on user deletion, purge Mongo docs **and** `deleteUserVectors`; on report deletion, `deleteReportVectors`. Provide a data-export/erase workflow (GDPR/local health-data laws).
- Minimize denormalized PHI snapshots (`userData`/`docData`) or ensure they inherit the same retention.
- Payments: rely on Stripe/Paymob tokenization; verify webhook signatures; store no raw card data.

## 6.9 Logging & monitoring
- Morgan access logs; centralized error middleware (no stack traces to clients in prod).
- Add security events: failed logins, role-violation attempts, AI access, payment webhooks.
- Alert on anomalies (spike in 401/403, AI error rate, webhook failures).

## 6.10 Security backlog (prioritized)
1. Enforce doctor↔patient **relationship check** before AI access and report reads.
2. Add **audit log** collection (who/what/when) for reports, cancellations, payments, AI queries.
3. Unify auth headers + add token denylist on logout.
4. Prompt-injection hardening on RAG context.
5. Per-route rate limits (auth, AI, chat) + login lockout.
6. Qdrant payload indexes + provider-side encryption verification.
