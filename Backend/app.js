import express from "express";
import authRouter from "./src/modules/auth/auth.routes.js";
import { errorMiddleware } from "./src/shared/middleware/error.middleware.js";

import patientRouter from "./src/modules/User/patient/patient.routes.js";

import userRouter from "./src/modules/User/patient/patient.routes.js";
import adminRouter from "./src/modules/User/admin/admin.routes.js";
import doctorRouter from "./src/modules/doctors/doctor.routes.js";
import appointmentRouter from "./src/modules/appointments/appointment.routes.js";
import consultationRouter from "./src/modules/consultations/consultation.routes.js";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.json({ status: "ok", app: "Avicana API " }));

app.use("/api/auth", authRouter);

app.use("/api/user", patientRouter);

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("api/doctor", doctorRouter);
// appointment
app.use("/api/appointment", appointmentRouter);
// consultation
app.use("/api/consultation", consultationRouter);
// reports
// lab
// chat
// notification
// subscriptions

app.use(errorMiddleware);

export default app;
