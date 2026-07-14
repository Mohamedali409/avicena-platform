# Avicena Web (Next.js)

Single Next.js (App Router) application serving **four role-based dashboards** — Patient, Doctor, Admin, Lab — from one domain. Rationale and full plan: see [`../artifacts`](../artifacts).

## Why one app (not four sites)
The backend is one API and the roles interact (chat, video, notifications). A single app means shared realtime code, one design system, and one deploy. Roles are separated by **route groups** and protected by a **RoleGuard**.

## Key architectural decision: role-aware auth
The Avicena API expects a **different auth header per role**:

| Role | Header |
|------|--------|
| Patient | `Authorization: Bearer <token>` |
| Doctor | `dtoken` |
| Admin | `atoken` |
| Lab | `ltoken` |

This is centralized in **one place** so feature code never worries about it:
- `src/config/roles.ts` — maps role → header + home + base path.
- `src/lib/api/client.ts` — Axios request interceptor injects the right header from the stored session; response interceptor does transparent refresh-token rotation for patients on 401.

## Structure
```
src/
├── app/                         # App Router
│   ├── (public)/doctors/        # SSR public doctor listing
│   ├── (auth)/login | register  # unified auth
│   ├── (patient)/patient/*      # guarded role=patient
│   ├── (doctor)/doctor/*        # guarded role=doctor (chat has Medical-AI panel)
│   ├── (admin)/admin/*          # guarded role=admin
│   └── (lab)/lab/*              # guarded role=lab
├── components/{ui,shared}       # design system + RoleGuard, Providers
├── features/<domain>/           # per-domain API clients + hooks + UI
│   ├── patient/api.ts           # /api/user/*
│   ├── medical-ai/api.ts        # /api/medical-ai/*  (doctor only)
│   └── ...
├── lib/
│   ├── api/client.ts            # axios + role interceptor  ← core
│   ├── auth/session.ts          # session persistence
│   └── socket/socket.ts         # shared Socket.io connection
├── store/auth.store.ts          # zustand auth (login/logout/hydrate)
├── config/roles.ts              # role → header/home mapping  ← core
└── hooks/ types/
```

## Getting started
```bash
cp .env.example .env
npm install
npm run dev   # http://localhost:3000  (API expected on :4000)
```

## Conventions
- **Arabic-first / RTL** by default (`<html dir="rtl">`).
- Data fetching via React Query hooks living in `features/*`.
- Never place API secrets here — only `NEXT_PUBLIC_*` reaches the browser.
- Guard every role subtree with `<RoleGuard role="…">` in its group `layout.tsx`.

> This is a **scaffold**: layouts, guards, auth, and the API pattern are wired; individual pages contain `TODO`s pointing at the endpoints from `../artifacts/05-api-specification.md`.
