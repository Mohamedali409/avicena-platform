import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/ApiResponse.js";
import * as notifService from "./notification.service.js";

const getRecipient = (req) => ({
  id: req.userId || req.docId,
  type: req.userId ? "user" : "doctor",
});

export const getNotifications = catchAsync(async (req, res) => {
  const { id, type } = getRecipient(req);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const data = await notifService.getNotifications(id, type, { page, limit });
  successResponse(res, "Done get notification", data);
});

export const getUnreadCount = catchAsync(async (req, res) => {
  const { id } = getRecipient(req);
  const count = await notifService.getUnreadCount(id);
  successResponse(res, "عدد الإشعارات غير المقروءة", { count });
});

export const markAllRead = catchAsync(async (req, res) => {
  const { id } = getRecipient(req);
  await notifService.markAllRead(id);
  successResponse(res, "تم تحديث الإشعارات");
});

export const markOneRead = catchAsync(async (req, res) => {
  const { id } = getRecipient(req);
  await notifService.markOneRead(id, req.params.id);
  successResponse(res, "تم قراءة الإشعار");
});
