# 5. API Specification

**Base URL:** `http://localhost:4000` · **Prefix:** `/api` · **Format:** JSON (`10mb` limit) · **Realtime:** Socket.io (same origin).

## 5.1 Authentication schemes
The API uses **role-specific token headers** (by design in the current backend):

| Role | Header | Value |
|------|--------|-------|
| Patient | `Authorization` | `Bearer <accessToken>` |
| Doctor | `dtoken` | `<token>` |
| Admin | `atoken` | `<token>` |
| Lab | `ltoken` | `<token>` |

Login responses: patient login returns `data.accessToken` + `data.refreshToken` (+ `data.user`); doctor/admin/lab return `data.token`.

## 5.2 Standard envelope
```jsonc
// success
{ "success": true, "message": "…", "data": { /* payload */ } }
// paginated
{ "success": true, "data": { "items": [], "page": 1, "limit": 10, "total": 42, "totalPages": 5 } }
// error
{ "success": false, "message": "Human readable error", "error": "CODE_OR_DETAIL" }
```

## 5.3 Error codes
| HTTP | Meaning | Typical cause |
|------|---------|---------------|
| 400 | Bad Request | validation failure (zod), malformed body |
| 401 | Unauthorized | missing/invalid/expired token |
| 403 | Forbidden | wrong role for the route |
| 404 | Not Found | unknown id |
| 409 | Conflict | slot double-booking, duplicate email/nationalId |
| 422 | Unprocessable | semantic validation (e.g., message > 500) |
| 429 | Too Many Requests | rate limit exceeded |
| 500 | Server Error | unhandled / upstream (AI, payment) failure |

---

## 5.4 Endpoints

### 🔐 Auth — `/api/auth`
| Method | Path | Auth | Body | Purpose |
|--------|------|------|------|---------|
| POST | `/register` | — | `{name,email,password}` | Patient register → `accessToken`,`refreshToken` |
| POST | `/login` | — | `{email,password}` | Patient login |
| POST | `/refresh` | — | `{refreshToken}` | Rotate access token |
| POST | `/logout` | Bearer | — | Invalidate session |
| POST | `/admin/login` | — | `{email,password}` | Admin login → `token` |
| POST | `/doctor/login` | — | `{email,password}` | Doctor login → `token` |
| POST | `/lab/login` | — | `{email,password}` | Lab login → `token` |

**Register/Login 200 (patient) example**
```jsonc
{ "success": true, "data": {
  "accessToken": "eyJhbGci…", "refreshToken": "eyJhbGci…",
  "user": { "_id": "…", "name": "Ahmed Mohamed", "email": "ahmed@test.com", "role": "patient" } } }
```

### 👤 Patient — `/api/user`
| Method | Path | Auth | Body / Query | Purpose |
|--------|------|------|--------------|---------|
| GET | `/profile` | Bearer | — | Get profile |
| PUT | `/profile` | Bearer | formdata `name,phone,gender,dob,nationality,nationalId,address(json),image(file)` | Update profile |
| GET | `/stats` | Bearer | — | Usage stats |
| POST | `/appointments` | Bearer | `{docId,slotDate,slotTime}` | Book appointment |
| GET | `/appointments` | Bearer | `?page&limit` | List (paginated) |
| PATCH | `/appointments/cancel` | Bearer | `{appointmentId}` | Cancel |
| GET | `/reports` | Bearer | — | My reports |
| GET | `/consultations` | Bearer | — | My consultations |
| POST | `/consultations/single` | Bearer | `{appointmentId,docId}` | One consultation |
| PATCH | `/consultations/time` | Bearer | `{consultationId,consultTime}` | Reschedule |
| PATCH | `/consultations/cancel` | Bearer | `{consultationId,docId}` | Cancel |

`slotDate` format: `D_M_YYYY` (e.g. `20_1_2026`). `slotTime` format: `hh:mm am/pm`.

### 👨‍⚕️ Doctor — `/api/doctor`
| Method | Path | Auth | Body | Purpose |
|--------|------|------|------|---------|
| GET | `/list` | — | — | Public doctor list |
| GET | `/profile` | dtoken | — | Profile |
| PUT | `/profile` | dtoken | `{fees,consultation_fees,available,phone,address,start_booked}` | Update |
| GET | `/dashboard` | dtoken | — | KPIs |
| GET | `/appointments` | dtoken | — | List |
| PATCH | `/appointments/complete` | dtoken | `{appointmentId}` | Complete |
| PATCH | `/appointments/cancel` | dtoken | `{appointmentId}` | Cancel |
| POST | `/reports` | dtoken | `{appointmentId,complaint,examination,diagnosis,treatment[],notes,nextVisit}` | Create report (→ AI index) |
| GET | `/reports` | dtoken | — | All own reports |
| POST | `/reports/patient` | dtoken | `{userId}` | Reports for a patient |
| PUT | `/reports` | dtoken | `{reportId,…fields}` | Edit report |
| DELETE | `/reports` | dtoken | `{reportId}` | Delete (→ purge vectors) |
| POST | `/consultations` | dtoken | `{userId,appointmentId,consultDay,amount,notes}` | Create |
| GET | `/consultations` | dtoken | — | List |
| PATCH | `/consultations/complete` | dtoken | `{consultationId,userId}` | Complete |
| PATCH | `/consultations/cancel` | dtoken | `{consultationId,userId}` | Cancel |
| POST | `/search` | dtoken | `{q}` | Search patients |
| POST | `/patient-stats` | dtoken | `{userId}` | Patient stats |
| DELETE | `/slots` | dtoken | — | Clear booked slots |

### 🛡️ Admin — `/api/admin`
| Method | Path | Auth | Body | Purpose |
|--------|------|------|------|---------|
| GET | `/dashboard` | atoken | — | Global metrics |
| POST | `/doctors` | atoken | formdata (doctor fields + `image` file) | Add doctor |
| GET | `/doctors` | atoken | — | All doctors |
| DELETE | `/doctors` | atoken | `{docId}` | Remove |
| PATCH | `/doctors/availability` | atoken | `{docId}` | Toggle availability |
| GET | `/appointment` | atoken | — | All appointments |
| PATCH | `/appointment/cancel` | atoken | `{appointmentId}` | Cancel |
| GET | `/consultations` | atoken | — | All consultations |
| POST | `/consultations/user` | atoken | `{userId}` | User's consultations |
| PATCH | `/consultation/cancel` | atoken | `{consultationId,userId,docId}` | Cancel |
| GET | `/reports` | atoken | — | All reports |
| POST | `/reports/user` | atoken | `{userId}` | User reports |
| DELETE | `/report` | atoken | `{reportId}` | Delete |
| PUT | `/report` | atoken | `{reportId,…fields}` | Edit |
| GET | `/users` | atoken | — | All users |
| GET | `/users/search` | atoken | `?q=` | Search users |
| PATCH | `/users/status` | atoken | `{userId}` | Toggle active |

### 🏥 Labs — `/api/lab`
| Method | Path | Auth | Body | Purpose |
|--------|------|------|------|---------|
| GET | `/` | — | — | All labs (public) |
| GET | `/:id` | — | — | Lab by id |
| GET | `/me/profile` | ltoken | — | My lab |
| PUT | `/me/profile` | ltoken | formdata `name,phone,address(json),workingHours(json)` | Update |
| POST | `/` | atoken | formdata `name,email,password,phone,address,tests(json)` | Add lab (admin) |

### 💬 Chat — `/api/chat`
| Method | Path | Auth | Body / Query | Purpose |
|--------|------|------|--------------|---------|
| POST | `/request` | Bearer | `{docId,initialMessage}` | Send chat request → `roomId` |
| GET | `/my-requests` | Bearer | — | Patient's requests |
| GET | `/doctor/requests` | dtoken | `?status=pending` | Doctor's requests |
| PATCH | `/doctor/requests/accept` | dtoken | `{roomId}` | Accept |
| PATCH | `/doctor/requests/reject` | dtoken | `{roomId,rejectReason}` | Reject |
| GET | `/room/:roomId` | Bearer/dtoken | `?page&limit` | Room messages (paginated) |
| GET | `/conversations` | Bearer/dtoken | — | Conversation list |
| GET | `/room/:doctorId/id` | Bearer | — | Resolve roomId with doctor |
| GET | `/room/:roomId/unread` | Bearer/dtoken | — | Unread count |
| PATCH | `/room/:roomId/read` | Bearer/dtoken | — | Mark read |

### 🤖 Medical AI (RAG) — `/api/medical-ai` (doctor only)
| Method | Path | Auth | Body | Purpose |
|--------|------|------|------|---------|
| GET | `/summary/:userId` | dtoken | — | Auto patient summary |
| POST | `/ask` | dtoken | `{userId,question,chatHistory[]}` | Grounded Q&A |
| POST | `/index-report` | dtoken | `{report:{…}}` | Manually index a report |

**`/ask` 200 example**
```jsonc
{ "success": true, "data": { "answer": "Based on the report dated 15/01/2026, Amoxicillin 500mg was prescribed for 7 days." } }
```
`chatHistory` items: `{role:"user"|"assistant", content:"…"}` — only the **last 6** are used.

### 🔔 Notifications — `/api/notifications`
| Method | Path | Auth | Query | Purpose |
|--------|------|------|-------|---------|
| GET | `/` | Bearer/dtoken | `?page&limit` | Feed |
| GET | `/unread` | Bearer/dtoken | — | Unread count |
| PATCH | `/:id/read` | Bearer/dtoken | — | Mark one |
| PATCH | `/read-all` | Bearer/dtoken | — | Mark all |

### 💳 Subscriptions — `/api/subscriptions`
| Method | Path | Auth | Body | Purpose |
|--------|------|------|------|---------|
| POST | `/` | Bearer | `{plan}` | Subscribe (`free`/`basic`/`premium`) |
| GET | `/active` | Bearer | — | Active subscription |
| DELETE | `/cancel` | Bearer | — | Cancel |

### 🎥 Video Call — `/api/video-call`
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/history` | Bearer/dtoken | Call history |

Live signaling is over Socket.io (WebRTC/simple-peer), not REST.

### 📋 Shared lookups
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/appointment/:id` | Bearer | Appointment by id |
| GET | `/api/report/:id` | Bearer | Report by id |
| GET | `/api/consultation/:id` | Bearer | Consultation by id |

> Note: the backend also mounts `/appointment`, `/consultation`, `/report`, `/lab` **without** the `/api` prefix as aliases. Prefer the `/api/*` forms for the frontend.

---

## 5.5 Socket.io events (contract)
Namespace: default. Auth handshake via token (see `infrastructure/socket/socket.auth.js`).

| Event | Direction | Payload | Purpose |
|-------|-----------|---------|---------|
| `join` / `room:join` | C→S | `{roomId}` | Join a chat room |
| `message:send` | C→S | `{roomId,message}` | Send message |
| `message:new` | S→C | message doc | Deliver message |
| `message:read` | C→S | `{roomId}` | Read receipt |
| `typing` | C↔S | `{roomId,isTyping}` | Typing indicator |
| `notification:new` | S→C | notification doc | Push notification |
| `call:invite` / `call:answer` / `call:ice` / `call:end` | C↔S | WebRTC signal | Video signaling |

> Exact event names should be reconciled against `chat.socket.js`, `notification.socket.js`, and `video.socket.js` during frontend integration.

## 5.6 Rate limiting & headers
- `helmet` security headers on all responses.
- `express-rate-limit` applied (tune per-route for auth & AI).
- `compression` enabled. CORS restricted to the web origin(s).
