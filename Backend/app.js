import express from "express";
import authRouter from "./src/modules/auth/auth.routes.js";
import { errorMiddleware } from "./src/shared/middleware/error.middleware.js";
import patientRouter from "./src/modules/User/patient/patient.routes.js";

import userRouter from "./src/modules/User/patient/patient.routes.js";
import adminRouter from "./src/modules/User/admin/admin.routes.js";
import doctorRouter from "./src/modules/doctors/doctor.routes.js";
import appointmentRouter from "./src/modules/appointments/appointment.routes.js";
import consultationRouter from "./src/modules/consultations/consultation.routes.js";

import reportRouter from "./src/modules/report/report.routes.js";
import labRouter from "./src/modules/labs/labs.routes.js";

import chatRouter from "./src/modules/chat/chat.routes.js";
import videoRouter from "./src/modules/video-call/video.routes.js";
import notificationRouter from "./src/modules/notifications/notification.routes.js";
import subscriptionRouter from "./src/modules/subscriptions/subscription.routes.js";
import medicalAiRouter from "./src/modules/medical-ai/medical.ai.routes.js";
import pharmacyApplicationRoutes from "./src/modules/pharmacy/application/application.routes.js";

import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { metricsMiddleware } from "./src/infrastructure/monitoring/metrics.middleware.js";
import { register } from "./src/infrastructure/monitoring/metrics.service.js";

const app = express();

// CORS — allow the web app to call the API from the browser.
// In dev, reflect the request origin; in prod, restrict via CLIENT_ORIGIN (comma-separated).
const allowedOrigins = process.env.CLIENT_ORIGIN?.split(",").map((o) =>
  o.trim(),
);
app.use(
  cors({
    origin: allowedOrigins && allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  }),
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(metricsMiddleware);

app.get("/", (req, res) =>
  res.json({
    status: "ok",
    app: "Avicena API",
  }),
);

app.get("/api/health", (req, res) =>
  res.json({
    status: "healthy",
    timestamp: Date.now(),
  }),
);

// Prometheus Metrics
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// ── API Routes ────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
// appointment

app.use("/api/appointment", appointmentRouter);
// consultation
app.use("/api/consultation", consultationRouter);
// reports
app.use("/api/report", reportRouter);
// lab
app.use("/api/lab", labRouter);

app.use("/appointment", appointmentRouter);
// consultation
app.use("/consultation", consultationRouter);
// reports
app.use("/report", reportRouter);
// lab
app.use("/lab", labRouter);

// chat
app.use("/api/chat", chatRouter);
// video call
app.use("/api/video-call", videoRouter);
// notification
app.use("/api/notifications", notificationRouter);
// subscriptions
app.use("/api/subscriptions", subscriptionRouter);

// medical AI (RAG)
app.use("/api/medical-ai", medicalAiRouter);

// pharmacy
app.use("/api/v1/pharmacy/applications", pharmacyApplicationRoutes);

// ── Error Handler ─────────────────────────────────────────
app.use(errorMiddleware);

export default app;
