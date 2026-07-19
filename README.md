# 🏥 Avicena – Healthcare SaaS Platform

Avicena is a full-stack, scalable Healthcare SaaS platform designed to connect patients, doctors, laboratories, pharmacies, and admins in a unified digital ecosystem.

Inspired by the legacy of Ibn Sina (Avicenna), the platform digitizes healthcare services through real-time communication, video consultations, AI-powered medical assistance, medical records management, and intelligent healthcare workflows — all containerized with Docker for consistent deployment.

---

## 🚀 Project Vision

To build a complete digital healthcare SaaS ecosystem that enables:

- Seamless communication between patients and doctors
- Online appointment booking and consultation management
- Real-time chat with doctor approval workflow
- WebRTC video consultations
- Medical reports with PDF generation and email delivery
- An AI-powered medical assistant grounded in patients' own medical records (RAG)
- An integrated online pharmacy (products, inventory, prescriptions, coupons)
- Integration with laboratories and radiology centers
- Subscription-based access model (SaaS) with real payment processing
- Scalable Dockerized architecture ready for production

---

## ✅ Current Status

| Feature                                  | Status         |
| ----------------------------------------- | -------------- |
| Authentication (JWT + Google OAuth)       | ✅ Done        |
| OTP Verification & Password Reset         | ✅ Done        |
| Patient & Doctor Management               | ✅ Done        |
| Appointment System                        | ✅ Done        |
| Consultation System                       | ✅ Done        |
| Medical Reports + PDF                     | ✅ Done        |
| Real-time Chat (with approval flow)       | ✅ Done        |
| Notifications System                      | ✅ Done        |
| Video Calls (WebRTC + Socket.io)          | ✅ Done        |
| Labs Module                               | ✅ Done        |
| Subscription System                       | ✅ Done        |
| Pharmacy Module (products, inventory, orders, coupons) | ✅ Done |
| RAG AI Medical Assistant (Qdrant + Gemini + Cerebras) | ✅ Done |
| Payment Integration (Stripe + Paymob)     | ✅ Done        |
| BullMQ Job Queues (email, medication, notifications, reports) | ✅ Done |
| Redis Caching                             | ✅ Done        |
| Monitoring (Prometheus + Grafana)         | ✅ Done        |
| Docker Containerization (6 services)      | ✅ Done        |
| Admin Dashboard                           | ✅ Done        |
| Refresh Token Rotation + CSRF Protection  | ✅ Done        |
| Doctor Rating / Reviews                   | 🚧 In Progress |
| Settings Module                           | 🚧 In Progress |
| Full API Documentation (per-endpoint)     | 🚧 In Progress |
| Automated Testing                         | 🔜 Planned     |
| CI/CD Pipeline                            | 🔜 Planned     |
| Kubernetes Deployment                     | 🔜 Planned     |
| Audit Logs                                | 🔜 Planned     |

---

## 🧠 Core Features

### 👤 Auth System

- Patient registration & login
- Google OAuth 2.0
- OTP verification and password reset flow
- Doctor & Lab login (separate endpoints)
- Admin login (env-based credentials)
- JWT-based authentication with RBAC

### 📅 Appointment System

- Book, cancel appointments
- Smart slot management (conflict-free)
- Doctor availability scheduling
- Email confirmation on booking (via BullMQ queue)

### 💬 Real-Time Chat (with Approval Flow)

- Patient sends a chat request with an initial message
- Doctor receives real-time notification and approves or rejects
- After approval → full chat opens via Socket.io
- Rejected patients can retry after a period
- Message persistence in MongoDB
- Typing indicators + read receipts

### 🎥 Video Consultation

- WebRTC-based peer-to-peer video calls (simple-peer + Socket.io signaling)
- Real-time signaling via Socket.io
- Secure doctor–patient sessions

### 🧾 Medical Records System

- Doctors write reports after completed appointments
- PDF generation and delivery via email (PDFKit + Nodemailer, Arabic font support)
- Full consultation history per patient
- Prescriptions and treatment plans

### 🤖 RAG AI Medical Assistant

- Embeds patients' medical reports and history using Gemini embeddings
- Stores and retrieves vectors via Qdrant
- Generates grounded answers with a Cerebras-hosted LLM
- Answers patient questions using their own medical context

### 💊 Pharmacy Module

- Product catalog with inventory & stock batch tracking
- Prescription-linked medication ordering
- Medication schedules and reminders
- Pharmacy applications (onboarding) and management
- Coupons and redemption tracking
- Integrated order payment flow

### 🔔 Notifications System

- Real-time in-app notifications (Socket.io)
- Pagination + unread count
- Supports: patient, doctor, admin
- Types: appointment, consultation, report, chat, chat_request

### 🏥 Labs Module

- Lab profiles with tests and pricing
- Lab authentication (separate login)
- Admin can add/manage labs

### 💳 Subscriptions & Payments

- Free / Basic / Premium plans
- Feature-based access control
- Stripe and Paymob payment integration
- Webhook-based payment confirmation

### 📊 Admin Dashboard

- Doctor CRUD (add, remove, toggle availability)
- User management (search, activate/deactivate)
- All appointments and consultations overview
- Reports management (edit, delete)
- Platform statistics

### 📈 Monitoring & Observability

- Custom Prometheus metrics via middleware
- Grafana dashboards for real-time system health
- Request/queue/job performance tracking

---

## 🏗️ System Architecture

```
Frontend — Next.js 15 (App Router, TypeScript) — single app, route groups
├── (public)   → landing / marketing pages
├── (auth)     → login / register / OTP / reset password
├── (patient)  → patient portal
├── (doctor)   → doctor dashboard
├── (lab)      → lab dashboard
└── (admin)    → admin dashboard
          │
          ▼
Backend API (Node.js / Express) :4000
          │
    ┌─────┴────────────────────────┐
    │             │                │
Socket.io      REST API        BullMQ Workers
(real-time)     (HTTP)      (email/medication/report/notification)
          │
    ┌─────┴───────────────────────────────┐
    │         │           │               │
 MongoDB    Redis       Qdrant      Prometheus/Grafana
(Database) (Cache)   (Vector DB)      (Monitoring)
```

---

## 🧱 Backend Structure

```
Backend/
├── server.js
├── app.js
├── Dockerfile
└── src/
    ├── modules/
    │   ├── auth/
    │   ├── otp/                  ← OTP + password reset
    │   ├── User/                 ← patient / admin / user model
    │   ├── doctors/
    │   ├── appointments/
    │   ├── consultations/
    │   ├── report/
    │   ├── chat/
    │   │   ├── chat-request.model.js
    │   │   ├── chat.request.service.js
    │   │   └── chat.socket.js
    │   ├── video-call/            ← WebRTC signaling
    │   ├── notifications/
    │   ├── labs/
    │   ├── subscriptions/
    │   ├── medical-ai/            ← RAG assistant endpoints
    │   └── pharmacy/
    │       ├── pharmacy/
    │       ├── products/
    │       ├── inventory/
    │       ├── medicine/          ← prescriptions & reminders
    │       ├── order/
    │       ├── coupon/
    │       └── application/       ← pharmacy onboarding
    │
    ├── shared/
    │   ├── guards/                ← auth / doctor / admin / lab
    │   ├── middleware/            ← error, sanitize, rate-limit, multer
    │   └── utils/                 ← ApiError, ApiResponse, catchAsync, jwt, slots
    │
    └── infrastructure/
        ├── database/
        ├── redis/                 ← client + cache service
        ├── socket/                ← Socket.io server
        ├── storage/                ← Cloudinary
        ├── mail/                  ← Nodemailer
        ├── pdf/                   ← PDFKit (Arabic font support)
        ├── excel/                 ← xlsx export
        ├── queue/                 ← BullMQ (email, medication, notification, report)
        ├── payment/                ← Stripe + Paymob
        ├── monitoring/             ← Prometheus metrics
        └── ai/                     ← Qdrant client, embeddings, RAG service
```

---

## 🛠️ Tech Stack

| Layer            | Technology                                       |
| ----------------- | ------------------------------------------------ |
| Backend Runtime    | Node.js / Express 5                              |
| Frontend Framework | Next.js 15 (App Router) + React 19 + TypeScript  |
| Database          | MongoDB + Mongoose                                |
| Vector Database    | Qdrant                                            |
| Cache              | Redis / ioredis                                   |
| Real-time          | Socket.io                                         |
| Video Calls        | WebRTC (simple-peer)                              |
| Job Queues         | BullMQ                                            |
| AI / RAG           | Gemini embeddings, Cerebras SDK, Groq SDK          |
| Authentication     | JWT + Google OAuth + OTP                          |
| Payments           | Stripe, Paymob                                    |
| File Storage       | Cloudinary                                        |
| Email              | Nodemailer (Gmail)                                |
| PDF Generation     | PDFKit / pdfmake                                  |
| Monitoring         | Prometheus + Grafana                              |
| Containerization   | Docker + Docker Compose                           |
| Input Validation   | Zod                                               |
| Security           | Helmet, XSS protection, rate limiting             |
| State Management (FE) | Zustand, TanStack Query, React Hook Form       |

---

## 🐳 Docker Setup

The project is fully containerized with 6 services:

```
avicena-mongo        → MongoDB     :27017
avicena-redis         → Redis       :6379
avicena-qdrant        → Qdrant      :6333 / :6334
avicena-backend       → API         :4000
avicena-prometheus    → Prometheus  :9090
avicena-grafana       → Grafana     :3001
```

### Run with Docker (recommended)

```bash
git clone https://github.com/Mohamedali409/avicena-platform
cd avicena-platform

# Add your environment variables
cp Backend/.env.example Backend/.env

# Start all services
docker compose up -d

# View logs
docker compose logs -f backend

# Stop
docker compose down
```

### Run locally (without Docker)

```bash
cd Backend
npm install
npm run dev

# In another terminal
cd Frontend
npm install
npm run dev
```

---

## 🌱 Environment Variables

```env
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URL=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net
DB_NAME=avicena

# JWT
JWT_SECRET=your_super_secret_key_here

# Admin credentials (env-only, no DB record needed)
ADMIN_EMAIL=admin@avicena.com
ADMIN_PASSWORD=your_admin_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret

# Redis
REDIS_URL=redis://127.0.0.1:6379

# Qdrant / RAG AI
QDRANT_URL=http://127.0.0.1:6333
GOOGLE_AI_API_KEY=your_gemini_api_key
CEREBRAS_API_KEY=your_cerebras_api_key

# Email
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Payments
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
PAYMOB_API_KEY=your_paymob_api_key
```

---

## 🧭 Roadmap

**Phase 1 ✅ — Core System**

- Auth, Doctors, Patients, Appointments, Consultations, Reports

**Phase 2 ✅ — Real-time**

- Chat with approval flow, Notifications, Video Calls

**Phase 3 ✅ — Infrastructure**

- Redis caching, Docker, Labs, Subscriptions

**Phase 4 ✅ — Production Ready**

- OTP + password reset, BullMQ email/job queues, Admin dashboard, Stripe + Paymob payments, Prometheus/Grafana monitoring

**Phase 5 ✅ — AI & Pharmacy**

- RAG system reads patient medical reports (Qdrant + Gemini + Cerebras)
- AI medical assistant answers patient questions
- Full pharmacy module: products, inventory, prescriptions, coupons, orders

**Phase 6 🚧 — Polish & Hardening**

- Doctor rating / review system
- Settings module
- Full per-endpoint API documentation
- Automated testing (unit/integration)
- CI/CD pipeline
- Kubernetes deployment manifests
- Audit logs
- Refresh token rotation + CSRF protection

---

## 👨‍💻 Author

**Mohamed Ali** — Full Stack Developer  
🔗 [GitHub](https://github.com/Mohamedali409) · 📧 engmohamedali409@gmail.com

---

## 📌 Project Type

> Portfolio · Graduation Capstone · SaaS Simulation · Production-Level Architecture
