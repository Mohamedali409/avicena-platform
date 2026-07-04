# 🏥 Avicena – Healthcare SaaS Platform

Avicena is a full-stack, scalable Healthcare SaaS platform designed to connect patients, doctors, laboratories, and admins in a unified digital ecosystem.

Inspired by the legacy of Ibn Sina (Avicenna), the platform digitizes healthcare services through real-time communication, video consultations, medical records management, and intelligent healthcare workflows — all containerized with Docker for consistent deployment.

---

## 🚀 Project Vision

To build a complete digital healthcare SaaS ecosystem that enables:

- Seamless communication between patients and doctors
- Online appointment booking and consultation management
- Real-time chat with doctor approval workflow
- WebRTC video consultations
- Medical reports with PDF generation and email delivery
- Integration with laboratories and radiology centers
- Subscription-based access model (SaaS)
- Scalable Dockerized architecture ready for production

---

## ✅ Current Status

| Feature | Status |
|---|---|
| Authentication (JWT + Google OAuth) | ✅ Done |
| Patient & Doctor Management | ✅ Done |
| Appointment System | ✅ Done |
| Consultation System | ✅ Done |
| Medical Reports + PDF | ✅ Done |
| Real-time Chat (with approval flow) | ✅ Done |
| Notifications System | ✅ Done |
| Video Calls (WebRTC + Socket.io) | ✅ Done |
| Labs Module | ✅ Done |
| Subscription System | ✅ Done |
| Redis Caching | ✅ Done |
| Docker Containerization | ✅ Done |
| Admin Dashboard | 🚧 In Progress |
| BullMQ Email Queues | 🚧 In Progress |
| RAG AI Medical Assistant | 🔜 Planned |
| Payment Integration (Stripe) | 🔜 Planned |

---

## 🧠 Core Features

### 👤 Auth System
- Patient registration & login
- Google OAuth 2.0
- Doctor & Lab login (separate endpoints)
- Admin login (env-based credentials)
- JWT-based authentication with RBAC

### 📅 Appointment System
- Book, cancel appointments
- Smart slot management (conflict-free)
- Doctor availability scheduling
- Email confirmation on booking

### 💬 Real-Time Chat (with Approval Flow)
- Patient sends a chat request with an initial message
- Doctor receives real-time notification and approves or rejects
- After approval → full chat opens via Socket.io
- Rejected patients can retry after a period
- Message persistence in MongoDB
- Typing indicators + read receipts

### 🎥 Video Consultation
- WebRTC-based peer-to-peer video calls
- Real-time signaling via Socket.io
- Secure doctor–patient sessions

### 🧾 Medical Records System
- Doctors write reports after completed appointments
- PDF generation and delivery via email (PDFKit + Nodemailer)
- Full consultation history per patient
- Prescriptions and treatment plans

### 🔔 Notifications System
- Real-time in-app notifications (Socket.io)
- Pagination + unread count
- Supports: patient, doctor, admin
- Types: appointment, consultation, report, chat, chat_request

### 🏥 Labs Module
- Lab profiles with tests and pricing
- Lab authentication (separate login)
- Admin can add/manage labs

### 💳 Subscription System
- Free / Basic / Premium plans
- Feature-based access control
- Subscription lifecycle management

### 📊 Admin Dashboard
- Doctor CRUD (add, remove, toggle availability)
- User management (search, activate/deactivate)
- All appointments and consultations overview
- Reports management (edit, delete)
- Platform statistics

---

## 🏗️ System Architecture

```
Frontend (React + Vite) — 3 separate apps
├── Patient App      :5173
├── Doctor Dashboard :5174
└── Admin Dashboard  :5175
          │
          ▼
Backend API (Node.js / Express)  :4000
          │
    ┌─────┴──────┐
    │            │
Socket.io      REST API
(real-time)   (HTTP)
          │
    ┌─────┴───────────────┐
    │         │           │
 MongoDB    Redis       BullMQ
(Database) (Cache)     (Queues)
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
    │   ├── users/
    │   │   ├── user.model.js
    │   │   ├── patient/          ← patient controller + routes
    │   │   └── admin/            ← admin controller + routes
    │   ├── doctors/
    │   ├── appointments/
    │   ├── consultations/
    │   ├── reports/
    │   ├── chat/
    │   │   ├── chat-request.model.js
    │   │   ├── chat-request.service.js
    │   │   └── chat.socket.js
    │   ├── notifications/
    │   ├── labs/
    │   └── subscriptions/
    │
    ├── shared/
    │   ├── guards/               ← auth / doctor / admin / lab
    │   ├── middleware/           ← error, sanitize, rate-limit, multer
    │   └── utils/                ← ApiError, ApiResponse, catchAsync, jwt, slots
    │
    └── infrastructure/
        ├── database/
        ├── redis/                ← client + cache service
        ├── socket/               ← Socket.io server
        ├── storage/              ← Cloudinary
        ├── mail/                 ← Nodemailer
        ├── pdf/                  ← PDFKit
        └── queue/                ← BullMQ (planned)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Cache | Redis |
| Real-time | Socket.io |
| Video Calls | WebRTC |
| Job Queues | BullMQ |
| Authentication | JWT + Google OAuth |
| File Storage | Cloudinary |
| Email | Nodemailer (Gmail) |
| PDF Generation | PDFKit |
| Containerization | Docker + Docker Compose |
| Input Validation | Zod |
| Security | Helmet, XSS, Rate Limiting |

---

## 🐳 Docker Setup

The project is fully containerized with 3 services:

```
avicena-mongo    → MongoDB :27017
avicena-redis    → Redis   :6379
avicena-backend  → API     :4000
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
```

---

## 🌱 Environment Variables

```env
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

MONGODB_URL=mongodb://127.0.0.1:27017
DB_NAME=avicena

JWT_SECRET=your_secret_key

ADMIN_EMAIL=admin@avicena.com
ADMIN_PASSWORD=your_password

REDIS_URL=redis://127.0.0.1:6379

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_SECRET_KEY=your_secret

EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

---

## 🧭 Roadmap

**Phase 1 ✅ — Core System**
- Auth, Doctors, Patients, Appointments, Consultations, Reports

**Phase 2 ✅ — Real-time**
- Chat with approval flow, Notifications, Video Calls

**Phase 3 ✅ — Infrastructure**
- Redis caching, Docker, Labs, Subscriptions

**Phase 4 🚧 — Production Ready**
- BullMQ email queues, Admin dashboard, Stripe payments

**Phase 5 🔜 — AI**
- RAG system reads patient medical reports
- AI medical assistant answers patient questions
- Smart recommendations

---

## 👨‍💻 Author

**Mohamed Ali** — Full Stack Developer  
🔗 [GitHub](https://github.com/Mohamedali409) · 📧 engmohamedali409@gmail.com

---

## 📌 Project Type

> Portfolio · Graduation Capstone · SaaS Simulation · Production-Level Architecture
