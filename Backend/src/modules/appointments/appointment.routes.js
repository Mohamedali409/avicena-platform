import { Router } from "express";
import * as appointmentController from "./appointment.controller.js";
import { authGuard } from "../../shared/guards/auth.guard.js";

const router = Router();

router.get("/:id", authGuard, appointmentController.getAppointmentById);

export default router;
