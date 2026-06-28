import { Router } from "express";
import * as chatController from "./chat.controller.js";
import * as requestController from "./chat-request.controller.js";
import { doctorGuard } from "../../shared/guards/doctor.guard.js";
import { authGuard } from "../../shared/guards/auth.guard.js";

const router = Router();

const anyAuth = (req, res, next) => {
  if (req.headers.dtoken || req.cookies?.dtoken)
    return doctorGuard(req, res, next);
  return authGuard(req, res, next);
};

router.post("/request", authGuard, requestController.sendRequest);
router.post("/my-requests", authGuard, requestController.getMyRequests);

router.post("/doctor/requests", authGuard, requestController.getDoctorRequests);
router.post(
  "/doctor/request/accept",
  authGuard,
  requestController.acceeptRequest,
);
router.post(
  "/doctor/request/reject",
  authGuard,
  requestController.rejectRequest,
);

router.use(anyAuth);

router.get("/conversations", chatController.getMyConversations);
router.get("/room/:otherId/id", chatController.getRoomIdWith);
router.get("/room/:roomId", chatController.getRoomMessages);
router.get("/room/:roomId/unread", chatController.getRoomUnreadCount);
router.get("/room/:roomId/read", chatController.markRoomAsRead);

export default router;
