import { Router } from "express";
import { authGuard } from "../../shared/guards/auth.guard.js";
import { doctorGuard } from "../../shared/guards/doctor.guard.js";
import {
  getNotifications,
  markAllRead,
  getUnreadCount,
  markOneRead,
} from "./notification.controller.js";

const router = Router();

const anyAuth = (req, res, next) => {
  if (req.headers.dtoken || req.cookies?.dtoken)
    return doctorGuard(req, res, next);
  return authGuard(req, res, next);
};

router.use(anyAuth);

router.get("/", getNotifications);
router.get("/unread", getUnreadCount);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", markOneRead);

export default router;
