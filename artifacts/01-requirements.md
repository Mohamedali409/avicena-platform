# 1. Requirements

**Project:** Avicena Healthcare SaaS Platform
**Status:** Baseline (reverse-engineered from implemented backend + API v3)
**Owners:** Platform Engineering

---

## 1.1 Actors / Roles

| Role | Auth token header | Model | Notes |
|------|-------------------|-------|-------|
| **Patient** | `Authorization: Bearer <jwt>` | `User` (role `patient`) | Self-registers. Books appointments, chats, subscribes. |
| **Admin** | `atoken` | `User` (role `admin`) | Manages doctors, users, appointments, reports. |
| **Doctor** | `dtoken` | `Doctor` (role `doctor`) | Created by Admin. Writes reports, runs consultations, uses Medical AI. |
| **Lab** | `ltoken` | `Lab` | Created by Admin. Manages profile + test catalog. |
| **System/Worker** | n/a | BullMQ | Sends email, notifications, indexes reports into Qdrant. |

---

## 1.2 Functional Requirements

### FR-A · Authentication & Identity
- **FR-A1** Patient self-registration with name/email/password; returns access + refresh token.
- **FR-A2** Login for each role via dedicated endpoints (`/auth/login`, `/auth/admin/login`, `/auth/doctor/login`, `/auth/lab/login`).
- **FR-A3** Refresh-token rotation (`/auth/refresh`) issuing a new access token.
- **FR-A4** Logout invalidates the active session/refresh token.
- **FR-A5** Google identity support (`googleId` on `User`; password optional when present).
- **FR-A6** Passwords stored hashed (bcrypt/bcryptjs); `password` field never selected by default.

### FR-B · Patient Self-Service
- **FR-B1** View & update profile (name, phone, gender, dob, nationality, nationalId, address, image).
- **FR-B2** View personal usage stats (`/user/stats`).
- **FR-B3** Book an appointment against a doctor slot (`docId`, `slotDate`, `slotTime`).
- **FR-B4** List own appointments **with pagination** (`page`, `limit`).
- **FR-B5** Cancel an appointment.
- **FR-B6** View own medical reports.
- **FR-B7** View own consultations (list, single, update time, cancel).
- **FR-B8** A time slot already occupied by an appointment/consultation cannot be re-booked for the same user.

### FR-C · Doctor Workspace
- **FR-C1** Public doctor listing (`/doctor/list`) — no auth.
- **FR-C2** View & update own profile incl. fees, consultation_fees, availability, working window (`start_booked.from/to/booking_period`).
- **FR-C3** Dashboard aggregates (earnings, appointment counts, patients).
- **FR-C4** Manage appointments: list, complete, cancel.
- **FR-C5** CRUD medical reports (complaint, examination, diagnosis, treatment[], notes, nextVisit).
- **FR-C6** Fetch reports for a specific patient.
- **FR-C7** Manage consultations: create, list, complete, cancel.
- **FR-C8** Search patients; view per-patient stats.
- **FR-C9** Clear own booked slots.

### FR-D · Admin Console
- **FR-D1** Global dashboard metrics.
- **FR-D2** Add / remove / toggle-availability of doctors (with image upload).
- **FR-D3** View & cancel any appointment.
- **FR-D4** View all / per-user consultations; cancel any consultation.
- **FR-D5** View, edit, delete any report.
- **FR-D6** List, search, and toggle status (activate/deactivate) of users.
- **FR-D7** Onboard labs.

### FR-E · Labs
- **FR-E1** Public lab listing + lab-by-id.
- **FR-E2** Lab views/updates own profile (address, working hours, tests[], certifications).
- **FR-E3** Admin creates a lab with credentials + initial test catalog.

### FR-F · Chat + Request Flow (real-time)
- **FR-F1** Patient sends a **chat request** to a doctor with an initial message (≤500 chars). A `roomId` (`{userId}_{docId}`) is created.
- **FR-F2** Doctor lists pending requests, then **accepts** or **rejects** (with reason).
- **FR-F3** On acceptance, a real-time room opens; messages persist and stream over Socket.io.
- **FR-F4** Paginated room message history (`page`, `limit`).
- **FR-F5** List conversations per side; resolve room id with a doctor; unread count; mark room read.

### FR-G · Medical AI (RAG) — doctor only
- **FR-G1** Auto patient summary when a doctor opens a patient chat (`/medical-ai/summary/:userId`).
- **FR-G2** Ask free-text questions about a patient; answers grounded **only** in that patient's indexed reports (`/medical-ai/ask`).
- **FR-G3** Multi-turn context via `chatHistory` (last 6 turns used).
- **FR-G4** Manual/automatic indexing of a report into the vector store (`/medical-ai/index-report`).
- **FR-G5** Vectors are per-user isolated (Qdrant filter on `userId`); deleting a report/user purges its vectors.

### FR-H · Notifications
- **FR-H1** Paginated notification feed per recipient (user/doctor/admin/lab).
- **FR-H2** Types: appointment, consultation, report, system, payment, chat, chat_request.
- **FR-H3** Unread count; mark-one-read; mark-all-read. Delivered in real time via Socket.io.

### FR-I · Subscriptions & Billing
- **FR-I1** Plans: `free`, `basic`, `premium` with feature gates (max consultations/month, video-call, chat, priority support).
- **FR-I2** Subscribe, get active subscription, cancel.
- **FR-I3** Payment via Stripe and/or Paymob; webhook reconciliation.

### FR-J · Video Calls
- **FR-J1** WebRTC (simple-peer) signaling over Socket.io; call sessions recorded (`ringing/ongoing/ended/missed/rejected`, duration).
- **FR-J2** Call history per patient and per doctor.

### FR-K · Shared Lookups
- **FR-K1** Fetch appointment / report / consultation by id (authenticated).

---

## 1.3 Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-1 | **Security** | Helmet headers, CORS allow-list, rate limiting (`express-rate-limit`), JWT with short-lived access + rotating refresh, bcrypt hashing, role guards on every protected route. |
| NFR-2 | **Privacy (PHI)** | Medical data is sensitive. AI answers must never leak across patients (per-`userId` vector isolation) and must never fabricate (grounded-only prompt). |
| NFR-3 | **Performance** | Redis caching for hot reads; DB indexes on high-traffic queries; response compression; pagination mandatory on unbounded lists. |
| NFR-4 | **Scalability** | Stateless HTTP layer; async work offloaded to BullMQ workers; Socket.io horizontally scalable via Redis adapter. |
| NFR-5 | **Reliability** | Queue retries/backoff; graceful startup ordering (Redis → Mongo → workers → Qdrant → HTTP). |
| NFR-6 | **Observability** | Morgan request logs (`combined` in prod); structured error middleware; per-stage boot logging. |
| NFR-7 | **Maintainability** | Module-per-domain (controller/service/repository/model/routes/validation), infrastructure isolated, guards shared. |
| NFR-8 | **Portability** | 12-factor config via env vars; local defaults for Qdrant/Redis. |
| NFR-9 | **Payload limits** | JSON body capped at 10 MB; chat initial message ≤ 500 chars; AI answers capped at 600 tokens. |
| NFR-10 | **i18n** | Arabic-first clinical content; UI must support RTL. |

---

## 1.4 Assumptions & Constraints
- MongoDB, Redis, and Qdrant are reachable (Qdrant defaults to `http://localhost:6333`).
- External API keys required: `CEREBRAS_API_KEY`, `GEMINI_API_KEY`, Stripe/Paymob keys, Cloudinary creds, SMTP creds.
- Embedding dimension is **3072** (`gemini-embedding-001`); the Qdrant collection `medical_reports` must match.
- Doctors and Labs are **never self-registered** — always provisioned by Admin.

## 1.5 Out of Scope (current baseline)
- Pharmacy/e-prescription fulfillment, insurance claims, lab result upload workflow (schema hints exist but endpoints not exposed), multi-language clinical NLP beyond retrieval.
