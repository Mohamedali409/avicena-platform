import { Router } from "express";
import { adminGuard } from "../../../shared/guards/admin.guard.js";
import upload from "../../../shared/middleware/multer.midleware.js";
import * as adminController from "./admin.controller.js";

const router = Router();

router.use(adminGuard);

// Dashboard
router.get("/dashboard", adminController.getDashboard);

// Doctors
router.post("/doctors", upload.single("image"), adminController.addDoctor);
router.get("/doctors", adminController.getDoctors);
router.delete("/doctors", adminController.removeDoctor);
router.patch("/doctors/availability", adminController.toggleAvailability);

// Appointments
router.get("/appointment", adminController.getAllAppointments);

router.patch("/appointment/cancel", adminController.canceledAppointment);
router.patch("/appointment/complete", adminController.completeAppointment);

// Consultation
router.get("/consultations", adminController.getAllConsultations);
router.post("consultations/user", adminController.getUserConsultation);
router.patch("/consultation/cancel", adminController.cancelConsultation);
router.patch("/consultation/complete", adminController.completeConsultation);

//Router
router.get("/reports", adminController.getAllReports);
router.post("/reports/user", adminController.getUserReports);
router.patch("/report", adminController.deleteReport);
router.put("report", adminController.editReport);

// Users
router.get("/users", adminController.getAllUsers);
router.get("/users/search", adminController.searchUsers);
router.patch("/users/status", adminController.toggleUserStatus);

export default router;
