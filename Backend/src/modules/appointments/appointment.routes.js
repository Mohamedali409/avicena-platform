import { Router } from "express";
import * as appointmentController from "./appointment.controller.js";
import { authGuard } from "../../shared/guards/auth.guard.js";

const router = Router();

router.get("/", authGuard, appointmentController.getAppointmentById);

export default router;
