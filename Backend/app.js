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

import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => res.json({ status: "ok", app: "Avicana API " }));

// app.use("/api/auth", authRouter);
// app.use("/api/user", patientRouter);

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("api/doctor", doctorRouter);
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

app.use(errorMiddleware);

export default app;
