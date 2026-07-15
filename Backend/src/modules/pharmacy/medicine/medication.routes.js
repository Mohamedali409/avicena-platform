import { Router } from "express";
import * as medicationController from "./medication.controller.js";
import { authGuard } from "../../../shared/guards/auth.guard.js";

const router = Router();

router.use(authGuard);

router.post("/", medicationController.createSchedule);
router.post("/from-report/:reportId", medicationController.createFromReport);
router.get("/", medicationController.listSchedules);
router.patch("/:id/stop", medicationController.stopSchedule);

export default router;
