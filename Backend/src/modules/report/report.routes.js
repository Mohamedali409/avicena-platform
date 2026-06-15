import { Router } from "express";
import * as reportController from "./report.controller.js";
import { authGuard } from "../../shared/guards/auth.guard.js";

const router = Router();

router.get("/:id", authGuard, reportController.getReportById);

export default router;
