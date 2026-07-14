# 2. Business Requirements Document (BRD)

**Product:** Avicena — Telemedicine & Digital Health Platform
**Document type:** BRD · **Audience:** Stakeholders, Product, Engineering

---

## 2.1 Executive Summary
Avicena is a multi-role telemedicine SaaS that connects **patients**, **doctors**, **labs**, and **administrators** in one platform. Patients book and attend consultations (chat + video), doctors document care as structured medical reports, and an **AI clinical assistant** helps doctors instantly recall a patient's history — grounded strictly in that patient's own reports. Revenue is driven by subscription tiers and per-consultation fees.

## 2.2 Business Objectives
| # | Objective | Success signal |
|---|-----------|----------------|
| BO-1 | Reduce time-to-care by enabling remote appointments & consultations. | Avg. booking→consult time. |
| BO-2 | Give doctors instant, trustworthy patient context. | AI-assisted consult adoption; "no-fabrication" compliance. |
| BO-3 | Monetize via tiered subscriptions + consultation fees. | MRR, plan mix, ARPU. |
| BO-4 | Keep clinical data safe and compartmentalized. | Zero cross-patient data leaks; audit pass. |
| BO-5 | Scale to many concurrent real-time sessions. | Concurrent rooms/calls without degradation. |

## 2.3 Scope

### In scope
- 4 role-based portals (Patient, Doctor, Admin, Lab) on one web app.
- Appointment & consultation lifecycle (book → complete/cancel).
- Structured medical reporting with edit history by doctor/admin.
- Real-time chat with a **request/accept gate** protecting doctors.
- Doctor-only **RAG Medical AI** (summary + grounded Q&A).
- Notifications, subscriptions/payments, video calls, lab catalog.

### Out of scope (phase 1)
- Pharmacy fulfillment, insurance, native mobile apps, lab-result upload pipeline, analytics warehouse.

## 2.4 Personas

**Patient — "Ahmed", 29, Cairo.** Wants fast access to a trusted doctor, to keep his records in one place, and to consult without traveling. Pain: fragmented paper reports, long waits.

**Doctor — "Dr. Mona", General Physician.** Sees many patients; needs the history *now*, not to read PDFs mid-call. Wants control over who can message her. Pain: context-switching, unverifiable memory of past visits.

**Admin — "Operations".** Onboards doctors/labs, keeps the marketplace healthy, moderates content, resolves disputes (cancellations).

**Lab — "Cairo Medical Lab".** Wants to be discoverable and publish an accurate, priced test catalog.

## 2.5 Key Business Rules
- **BR-1** Doctors and labs are onboarded by Admin only.
- **BR-2** A patient cannot double-book the same time slot across appointments/consultations.
- **BR-3** Chat requires the doctor to **accept** a request before a room becomes active.
- **BR-4** The AI assistant answers **only** from the patient's reports; if unknown, it must say so — never guess. It is decision-support, not a diagnosis.
- **BR-5** AI data is isolated per patient; report/user deletion purges the corresponding vectors.
- **BR-6** Subscription tier gates features (e.g., video-call, monthly consultation quota).
- **BR-7** Only the authoring doctor (or Admin) may edit/delete a report.

## 2.6 Epics → Acceptance Criteria (samples, Gherkin)

**EPIC: Appointment Booking**
```
Scenario: Patient books a free slot
  Given an authenticated patient and an available doctor slot
  When the patient books docId + slotDate + slotTime
  Then an appointment is created with amount = doctor fees
  And the slot is marked booked on the doctor
  And a notification is sent to both parties

Scenario: Double booking is rejected
  Given the patient already has an appointment/consultation at that time
  When the patient tries to book the same slot
  Then the request is rejected with a clear conflict message
```

**EPIC: Chat Request Gate**
```
Scenario: Doctor accepts a request
  Given a pending chat request with a roomId
  When the doctor accepts it
  Then the room status becomes "accepted"
  And both users can exchange real-time messages
  And unread counts and read receipts are tracked
```

**EPIC: Medical AI (RAG)**
```
Scenario: Grounded answer
  Given a patient with indexed reports
  When the doctor asks "what medications were prescribed?"
  Then the answer is derived only from retrieved report chunks
  And it cites the relevant section/date

Scenario: No data available
  Given a patient with no matching report content
  When the doctor asks a question
  Then the assistant replies that the reports do not contain that information
```

## 2.7 Risks & Mitigations
| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| AI fabricates clinical info | High (patient safety, liability) | Med | Grounded-only prompt, retrieval filter, "unavailable" fallback, 600-token cap, doctor-in-the-loop. |
| Cross-patient PHI leak | High | Low | Per-`userId` Qdrant filter; delete cascades; auth guards. |
| Multiple token-header schemes cause auth bugs | Med | Med | Centralize in one Axios interceptor; document in API spec; plan unification. |
| Vector dim mismatch (768 vs 3072) | Med | Low | Pin `VECTOR_SIZE=3072`; validate on `initQdrant`. |
| Payment webhook race/fraud | High | Med | Signature verification, idempotent reconciliation. |
| Real-time scale limits | Med | Med | Redis Socket.io adapter; offload heavy work to BullMQ. |
| Doctor spam / harassment | Med | Med | Request/accept gate + reject reason + (future) block. |

## 2.8 KPIs
- Activation: % patients who complete ≥1 consultation.
- Engagement: DAU/MAU, messages/room, AI queries/consult.
- Revenue: MRR, plan distribution, consultation GMV.
- Quality: cancellation rate, AI "unavailable" vs answered ratio, response latency (p95).

## 2.9 Dependencies
Cerebras & Gemini APIs · Stripe/Paymob · Cloudinary · SMTP provider · Managed MongoDB/Redis/Qdrant.
