import { Router } from "express";
import { authGuard } from "../../shared/guards/auth.guard.js";
import * as subController from "./subscription.controller.js";

const router = Router();

router.get("/plans", subController.getPlans);

router.use(authGuard);

router.post("/", subController.subscribe);
router.get("/active", subController.getActiveSubscription);
router.get("/history", subController.getHistory);
router.delete("/cancel", subController.cancelSubscription);

export default router;
