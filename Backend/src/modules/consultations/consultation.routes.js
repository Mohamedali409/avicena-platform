import { Router } from "express";

import * as consultationController from "./consultation.controller.js";
import { authGuard } from "../../shared/guards/auth.guard.js";

const router = Router();

router.get("/:id", authGuard, consultationController.getConsultationById);

export default router;
