import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({
  register,
  prefix: "avicena_",
  labels: { app: "avicena-platform" },
});

// ── HTTP ──────────────────────────────────────────────────
export const httpRequestsTotal = new client.Counter({
  name: "avicena_http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

export const httpRequestDurationMs = new client.Histogram({
  name: "avicena_http_request_duration_ms",
  help: "HTTP request duration in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [10, 50, 100, 200, 500, 1000, 2000, 5000],
  registers: [register],
});

// ── Socket ────────────────────────────────────────────────
export const socketConnections = new client.Gauge({
  name: "avicena_socket_connections_active",
  help: "Active Socket.io connections",
  registers: [register],
});

// ── Appointments ──────────────────────────────────────────
export const appointmentsBooked = new client.Counter({
  name: "avicena_appointments_booked_total",
  help: "Total appointments booked",
  registers: [register],
});

export const appointmentsCancelled = new client.Counter({
  name: "avicena_appointments_cancelled_total",
  help: "Total appointments cancelled",
  registers: [register],
});

// ── Chat ──────────────────────────────────────────────────
export const chatMessagesTotal = new client.Counter({
  name: "avicena_chat_messages_total",
  help: "Total chat messages sent",
  labelNames: ["sender_type"],
  registers: [register],
});

export const chatRequestsTotal = new client.Counter({
  name: "avicena_chat_requests_total",
  help: "Total chat requests",
  labelNames: ["status"],
  registers: [register],
});

// ── Video ─────────────────────────────────────────────────
export const videoCallsTotal = new client.Counter({
  name: "avicena_video_calls_total",
  help: "Total video calls initiated",
  registers: [register],
});

// ── RAG AI ────────────────────────────────────────────────
export const ragResponseDurationMs = new client.Histogram({
  name: "avicena_rag_response_duration_ms",
  help: "RAG AI response duration in ms",
  labelNames: ["operation"],
  buckets: [500, 1000, 2000, 5000, 10000, 20000],
  registers: [register],
});

export const ragRequestsTotal = new client.Counter({
  name: "avicena_rag_requests_total",
  help: "Total RAG AI requests",
  labelNames: ["operation", "status"],
  registers: [register],
});

// ── Cache ─────────────────────────────────────────────────
export const cacheHits = new client.Counter({
  name: "avicena_cache_hits_total",
  help: "Redis cache hits",
  registers: [register],
});

export const cacheMisses = new client.Counter({
  name: "avicena_cache_misses_total",
  help: "Redis cache misses",
  registers: [register],
});

// ── Auth ──────────────────────────────────────────────────
export const authEventsTotal = new client.Counter({
  name: "avicena_auth_events_total",
  help: "Auth events",
  labelNames: ["event", "role"],
  registers: [register],
});

// ── Errors ────────────────────────────────────────────────
export const errorsTotal = new client.Counter({
  name: "avicena_errors_total",
  help: "Application errors",
  labelNames: ["type", "status_code"],
  registers: [register],
});

// ── Email Queue ───────────────────────────────────────────
export const emailQueueSize = new client.Gauge({
  name: "avicena_email_queue_size",
  help: "Email queue size",
  registers: [register],
});

export { register };
