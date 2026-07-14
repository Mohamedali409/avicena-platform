# Avicena Platform — Engineering Artifacts

This directory holds the full engineering documentation for the **Avicena Healthcare SaaS Platform**. Every artifact is derived from the actual backend implementation (`Backend/src`) and the API contract (`Backend/src/collections/Avicena-API-v3.postman_collection.json`).

| # | Artifact | File | Purpose |
|---|----------|------|---------|
| 1 | Requirements | [01-requirements.md](01-requirements.md) | Functional & non-functional requirements |
| 2 | BRD | [02-brd.md](02-brd.md) | Business scope, personas, acceptance criteria, risks |
| 3 | System Architecture | [03-system-architecture.md](03-system-architecture.md) | Context, container, component, deployment & data-flow views |
| 4 | Database Design | [04-database-design.md](04-database-design.md) | ERD, schema definitions, index strategy |
| 5 | API Specification | [05-api-specification.md](05-api-specification.md) | All endpoints, request/response schemas, error codes |
| 6 | Security Design | [06-security-design.md](06-security-design.md) | STRIDE threat model, sanitization, prompt boundaries |
| 7 | DevOps Design | [07-devops-design.md](07-devops-design.md) | Repository structure, CI/CD, Makefile, deployment |
| 8 | Test Strategy | [08-test-strategy.md](08-test-strategy.md) | Unit, integration, E2E, security test plans |
| 9 | Execution Plan | [09-execution-plan.md](09-execution-plan.md) | Milestones, epics, features, critical path, estimates |

## Project snapshot

- **Product:** Multi-tenant telemedicine platform (Patient · Doctor · Admin · Lab).
- **Backend:** Node.js + Express 5, modular DDD-style layout (`modules/` + `infrastructure/` + `shared/`).
- **Data:** MongoDB (Mongoose 9), Redis (cache/session/queues), Qdrant (RAG vectors).
- **Real-time:** Socket.io (chat, notifications, WebRTC signaling for video calls).
- **AI:** Cerebras `gpt-oss-120b` (LLM) + Google `gemini-embedding-001` (3072-dim embeddings) over Qdrant → doctor-facing Medical RAG assistant.
- **Async:** BullMQ workers (email, notifications, report indexing).
- **Payments:** Stripe + Paymob. **Media:** Cloudinary. **PDF:** pdfkit.
- **Frontend (planned):** Next.js (App Router) single app, role-based dashboards — see [07-devops-design.md](07-devops-design.md) and `/Frontend`.

> Convention: all diagrams are authored in Mermaid so they render on GitHub and in most Markdown viewers.
