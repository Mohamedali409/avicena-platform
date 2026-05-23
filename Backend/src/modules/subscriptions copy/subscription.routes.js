import { Router } from "express";
import { authGuard } from "../../shared/guards/auth.guard.js";
import { subscribe, getActiveSubscription, cancelSubscription } from "./subscription.controller.js";

const router = Router();

router.use(authGuard);

router.post("/",          subscribe);
router.get("/active",     getActiveSubscription);
router.delete("/cancel",  cancelSubscription);

export default router;
