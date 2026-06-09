import { Router } from "express";
import { authGuard } from "../../../shared/guards/auth.guard.js";
import upload from "../../../shared/middleware/multer.midleware.js";

import * as patientController from "./patient.controller.js";

const router = Router();

router.use(authGuard);

router.get("/profile", patientController.getProfile);
router.put("/profile", upload.single("image"), patientController.updateProfile);

// Appointments
router.post("/appointments", patientController.bookAppointment);
export default router;
