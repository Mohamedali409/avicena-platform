import { Router } from "express";
import { authGuard } from "../../shared/guards/auth.guard.js";
import { getNotifications, markAllRead, getUnreadCount } from "./notification.controller.js";

const router = Router();

router.use(authGuard);

router.get("/",          getNotifications);
router.get("/unread",    getUnreadCount);
router.patch("/read",    markAllRead);

export default router;
