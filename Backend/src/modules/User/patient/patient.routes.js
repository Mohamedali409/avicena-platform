import { Router } from "express";
import { authGuard } from "../../../shared/guards/auth.guard.js";
import upload from "../../../shared/middleware/multer.midleware.js";

import * as patientController from "./patient.controller.js";

const router = Router();

router.use(authGuard);

router.get("/profile", patientController.getProfile);
router.put("/profile", upload.single("image"), patientController.updateProfile);

// Appointments
router.get("/appointments", patientController.listAppointment);
router.post("/appointments", patientController.bookAppointment);
router.patch("/appointments/cancel", patientController.cancelAppointment);

// Router
router.get("/reports", patientController.getReport);

// Consultations
router.get("/consultations", patientController.getAllConsultations);
router.post("/consultations/single", patientController.getConsultation);
router.patch("/consultations/time", patientController.updateConsultationTime);
router.post("/consultations/cancel", patientController.cancelConsultation);

//Stats
router.get("/stats", patientController.getUserStats);

export default router;
