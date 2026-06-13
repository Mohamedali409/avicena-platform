import { Router } from "express";
import { doctorGuard } from "../../shared/guards/doctor.guard.js";
import * as doctorController from "./doctor.controller.js";

const router = Router();

// ── Public ─────────────────────────────────────────────
router.get("/list", doctorController.getDoctorList);

// ── Protected ──────────────────────────────────────────
router.use(doctorGuard);

// Profile
router.get("/profile", doctorController.getProfile);
router.put("/profile", doctorController.updateProfile);

// Appointments
router.get("/appointments", doctorController.getAppointments);
router.patch("/appointments/complete", doctorController.completeAppointment);
router.patch("/appointments/cancel", doctorController.cancelAppointment);

// Reports
router.post("/reports", doctorController.addReport);
router.get("/reports", doctorController.getAllReports);
router.post("/reports/patient", doctorController.getUserReports);
router.put("/reports", doctorController.editReport);
router.delete("/reports", doctorController.deleteReport);

// Consultations
router.post("/consultations", doctorController.createConsultation);
router.get("/consultations", doctorController.getConsultations);
router.patch("/consultations/complete", doctorController.completeConsultation);
router.patch("/consultations/cancel", doctorController.cancelConsultation);

// Dashboard
router.get("/dashboard", doctorController.getDashboard);

router.post("/search", doctorController.searchPatients);
router.delete("/slots", doctorController.clearSlots);
router.post("/patient-stats", doctorController.getPatientStats);

export default router;
