# 🏥 Avicena – Healthcare SaaS Platform

Avicena is a full-stack, scalable Healthcare SaaS platform designed to connect patients, doctors, laboratories, and healthcare providers in a unified digital ecosystem.

Inspired by the legacy of Ibn Sina (Avicenna), the platform aims to digitize healthcare services through modern web technologies including real-time communication, video consultations, subscription-based access, and intelligent healthcare workflows.

---

## 🚀 Project Vision

To build a complete digital healthcare SaaS ecosystem that enables:

- Seamless communication between patients and doctors
- Online appointment booking and management
- Real-time medical consultations (chat & video)
- Integration with laboratories and radiology centers
- Subscription-based access model (SaaS)
- Scalable architecture for future AI and automation features

---

## 🧠 Core Features

### 👨‍⚕️ Users & Doctors

- Patient registration & authentication
- Doctor profiles with specialization and availability
- Role-Based Access Control (RBAC)

### 📅 Appointment System

- Book, cancel, and reschedule appointments
- Smart doctor availability scheduling
- Conflict-free booking system

### 💬 Real-Time Chat System

- Socket.io based live chat
- Patient ↔ Doctor communication
- Message persistence in MongoDB
- Online/offline presence tracking using Redis

### 🎥 Video Consultation

- WebRTC-based video calls
- Real-time signaling via Socket.io
- Secure doctor-patient sessions

### 🧾 Medical Records System

- Consultation history tracking
- Medical reports management
- Prescriptions and patient history

### 🏥 Labs & Radiology Integration

- Lab centers management
- Upload and view medical results
- Doctor access to patient diagnostics

### 💳 Subscription System (SaaS Model)

- Free vs Paid plans
- Feature-based access control
- Subscription management system (future payments integration)

### 🔔 Notifications System

- Email notifications
- Real-time in-app notifications
- Event-driven system (planned with queues)

### 📊 Admin Dashboard (Planned)

- Platform analytics
- User management
- Revenue tracking
- Doctor & lab verification system

### 🤖 AI Chat Bot (Future Feature)

- Medical assistant chatbot
- Basic symptom guidance
- Smart healthcare recommendations

---

## 🏗️ System Architecture

The project follows a Modular Monolith Architecture using Clean Architecture principles, designed for future scalability into microservices.

Frontend (React / Next.js)
↓
Backend API (Node.js / Express)
↓

---

Modules Layer:

- Auth
- Users
- Doctors
- Appointments
- Chat
- Video Call
- Labs
- Subscriptions
- Notifications

---

Infrastructure Layer:

- MongoDB (Database)
- Redis (Cache + Queue)
- Socket.io (Real-time communication)
- External Services (Email, Payments, AI)

---

## 🧱 Backend Structure

src/
├── modules/
│ ├── auth
│ ├── users
│ ├── doctors
│ ├── appointments
│ ├── chat
│ ├── video-call
│ ├── consultations
│ ├── reports
│ ├── labs
│ ├── subscriptions
│ └── notifications
│
├── shared/
│ ├── middleware
│ ├── utils
│ ├── errors
│ └── guards (RBAC)
│
├── infrastructure/
│ ├── database (MongoDB)
│ ├── redis
│ ├── socket
│ ├── queue (BullMQ)
│ └── external-services
│
├── config/
├── app.js
└── server.js

---

## 🛠️ Tech Stack

Backend: Node.js, Express.js  
Database: MongoDB + Mongoose  
Real-time: Socket.io  
Video Calls: WebRTC  
Cache & Queue: Redis + BullMQ  
Authentication: JWT + RBAC  
File Storage: Cloudinary / AWS S3 (planned)

---

## ⚙️ Setup Instructions

git clone https://github.com/your-username/avicena-platform  
npm install  
npm run dev

---

## 🌱 Environment Variables

PORT=5000  
MONGO_URI=your_mongodb_uri  
JWT_SECRET=your_secret  
REDIS_URL=your_redis_url  
EMAIL_SERVICE_KEY=your_key

---

## 🧭 Roadmap

Phase 1 (MVP):

- Authentication system
- Doctor & patient management
- Appointment system

Phase 2:

- Real-time chat
- Notifications system
- File uploads (reports)

Phase 3:

- Video consultation
- Subscription system

Phase 4:

- Labs integration
- Admin dashboard
- Analytics system

Phase 5 (Advanced):

- AI chatbot assistant
- Smart recommendations system
- Mobile app (React Native)

---

## 🎯 Project Goal

Avicena is designed as a real-world SaaS healthcare platform simulating production-level architecture used in modern telemedicine systems.

---

## 👨‍💻 Author

ENG Mohamed Ali  
Full-Stack Developer  
Project Type: SaaS Healthcare Platform  
Purpose: Portfolio / Graduation Project / Startup Simulation

---

## 📌 Status

🚧 Active Development (MVP Phase)
