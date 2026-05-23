import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/ApiResponse.js";
import * as notifService from "./notification.service.js";

export const getNotifications = catchAsync(async (req, res) => {
  const id   = req.userId || req.docId;
  const type = req.userId ? "user" : "doctor";
  const notifications = await notifService.getNotifications(id, type);
  successResponse(res, "تم جلب الإشعارات", { notifications });
});

export const markAllRead = catchAsync(async (req, res) => {
  const id = req.userId || req.docId;
  await notifService.markAllRead(id);
  successResponse(res, "تم تحديث الإشعارات");
});

export const getUnreadCount = catchAsync(async (req, res) => {
  const id = req.userId || req.docId;
  const count = await notifService.getUnreadCount(id);
  successResponse(res, "عدد الإشعارات غير المقروءة", { count });
});
