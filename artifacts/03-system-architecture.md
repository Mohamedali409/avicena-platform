# 3. System Architecture

Views follow the **C4 model**: Context → Container → Component → Deployment, plus key data-flow sequences. Diagrams are Mermaid.

---

## 3.1 Context (C1)

```mermaid
graph TB
  Patient([Patient])
  Doctor([Doctor])
  Admin([Admin])
  Lab([Lab])

  subgraph Avicena["Avicena Platform"]
    Web[Web App - Next.js]
    API[Backend API - Express]
  end

  Cerebras[[Cerebras LLM]]
  Gemini[[Gemini Embeddings]]
  Stripe[[Stripe]]
  Paymob[[Paymob]]
  Cloudinary[[Cloudinary]]
  SMTP[[SMTP / Email]]

  Patient --> Web
  Doctor --> Web
  Admin --> Web
  Lab --> Web
  Web --> API

  API --> Cerebras
  API --> Gemini
  API --> Stripe
  API --> Paymob
  API --> Cloudinary
  API --> SMTP
```

---

## 3.2 Container (C2)

```mermaid
graph TB
  subgraph Client
    Web[Next.js App Router - role dashboards]
  end

  subgraph Edge
    API[Express 5 API + Socket.io server]
  end

  subgraph Async
    Workers[BullMQ Workers - email / notifications / report-index]
  end

  subgraph Data
    Mongo[(MongoDB - Mongoose)]
    Redis[(Redis - cache / session / queue / socket adapter)]
    Qdrant[(Qdrant - medical_reports vectors)]
  end

  subgraph External
    Cerebras[[Cerebras gpt-oss-120b]]
    Gemini[[gemini-embedding-001]]
    Pay[[Stripe / Paymob]]
    Cloud[[Cloudinary]]
    Mail[[SMTP]]
  end

  Web -- HTTPS REST --> API
  Web -- WSS Socket.io --> API
  API --> Mongo
  API --> Redis
  API --> Qdrant
  API -- enqueue --> Redis
  Workers -- consume --> Redis
  Workers --> Mongo
  Workers --> Mail
  Workers --> Qdrant
  API --> Cerebras
  API --> Gemini
  API --> Pay
  API --> Cloud
```

**Startup order** (`server.js`): `connectRedis()` → `connectDB()` → `startEmailWorker()` → `initQdrant()` → `server.listen()`. Socket.io is initialized on the HTTP server before listen.

---

## 3.3 Component (C3) — Backend module layout

The backend is organized **domain-first**. Each module owns a vertical slice:

```
modules/<domain>/
  <domain>.routes.js       # HTTP surface, guard wiring
  <domain>.controller.js   # request/response, no business logic
  <domain>.service.js      # business rules / orchestration
  <domain>.repository.js   # data access (Mongoose)
  <domain>.model.js        # schema
  <domain>.validation.js   # zod schemas (where present)
  <domain>.socket.js       # realtime handlers (chat/video/notifications)
```

```mermaid
graph LR
  subgraph Modules
    Auth[auth]
    Patient[User/patient]
    AdminM[User/admin]
    Doctor[doctors]
    Appt[appointments]
    Consult[consultations]
    Report[report]
    Labs[labs]
    Chat[chat + chat-request]
    Video[video-call]
    Notif[notifications]
    Subs[subscriptions]
    AI[medical-ai]
  end

  subgraph Shared
    Guards[guards: auth/admin/doctor]
    MW[middleware: error]
  end

  subgraph Infrastructure
    DB[database]
    RedisI[redis: cache/session]
    Queue[queue: bullmq]
    SocketI[socket]
    AImod[ai: rag / embedding / cerebras / qdrant]
    Storage[storage: cloudinary/upload]
    Payment[payment: stripe/paymob/webhook]
    Mail[mail]
    PDF[pdf]
  end

  Modules --> Shared
  Modules --> Infrastructure
  AI --> AImod
  Report --> Queue
  Chat --> SocketI
  Video --> SocketI
  Notif --> SocketI
```

### Layering rules
- **Controllers** never touch Mongoose directly — only services.
- **Services** hold business rules; call repositories + infrastructure.
- **Repositories** are the only place with model queries.
- **Infrastructure** is domain-agnostic and reusable.
- **Guards** (`auth.guard`, `admin.guard`, `doctor.guard`) enforce role + token-header per route.

---

## 3.4 Medical AI (RAG) component detail

```mermaid
graph LR
  Q[Doctor question] --> Svc[medical.ai.service]
  Svc --> Emb[embedding.server - Gemini]
  Emb --> Vec[query vector 3072]
  Vec --> RAG[rag.service.searchReports]
  RAG --> QD[(Qdrant filter userId)]
  QD --> Chunks[top-k report chunks]
  Chunks --> Prompt[System prompt + context + chatHistory-6]
  Prompt --> LLM[Cerebras gpt-oss-120b, max 600 tok]
  LLM --> Ans[Grounded answer]

  R[New/edited report] --> Chunk[chunkReport: complaint/dx/treatment/notes]
  Chunk --> EmbW[embed each chunk]
  EmbW --> Up[qdrant.upsert points]
```

Vector isolation: every point carries `userId`, `docId`, `reportId`, `section`; retrieval filters `must userId == patient`. Deletions filter by `userId` or `reportId`.

---

## 3.5 Deployment (C4)

```mermaid
graph TB
  subgraph CDN
    Vercel[Next.js on Vercel/Node host]
  end
  subgraph AppTier["App Tier (containers)"]
    API1[API instance 1]
    API2[API instance N]
    W1[Worker 1..N]
  end
  subgraph Managed
    MongoAtlas[(MongoDB Atlas)]
    RedisMgd[(Managed Redis)]
    QdrantMgd[(Qdrant Cloud/self-host)]
  end
  Users((Users)) --> Vercel --> LB[Load Balancer] --> API1
  LB --> API2
  API1 --> RedisMgd
  API2 --> RedisMgd
  W1 --> RedisMgd
  API1 --> MongoAtlas
  API1 --> QdrantMgd
  RedisMgd -. socket.io adapter .- API1
  RedisMgd -. socket.io adapter .- API2
```

- **Stateless API** instances behind an LB; sticky sessions **not** required if the Socket.io Redis adapter is enabled.
- **Workers** scale independently of the API.
- Managed data services with backups/replication.

---

## 3.6 Key runtime data flows

**Booking**
```mermaid
sequenceDiagram
  participant P as Patient (Web)
  participant API
  participant DB as MongoDB
  participant Q as BullMQ
  P->>API: POST /api/user/appointments
  API->>DB: check slot & user conflicts
  DB-->>API: ok
  API->>DB: create appointment, mark slot booked
  API->>Q: enqueue notification + email
  API-->>P: 201 appointment
```

**Chat request → accept → message**
```mermaid
sequenceDiagram
  participant P as Patient
  participant API
  participant D as Doctor
  participant S as Socket.io
  P->>API: POST /api/chat/request (roomId={userId}_{docId})
  API-->>D: notification (chat_request)
  D->>API: PATCH /api/chat/doctor/requests/accept
  API-->>P: notification (accepted)
  P->>S: message:send (room)
  S->>D: message:new (real-time)
  API->>DB: persist message, unread++
```

**Report indexing (AI)**
```mermaid
sequenceDiagram
  participant D as Doctor
  participant API
  participant Q as report.queue
  participant G as Gemini
  participant QD as Qdrant
  D->>API: POST /api/doctor/reports
  API->>DB: save report
  API->>Q: enqueue index-report
  Q->>G: embed chunks
  G-->>Q: vectors (3072)
  Q->>QD: upsert points (userId scoped)
```
