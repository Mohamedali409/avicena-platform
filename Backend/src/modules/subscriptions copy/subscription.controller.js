import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/ApiResponse.js";
import * as subService from "./subscription.service.js";

export const subscribe            = catchAsync(async (req, res) => {
  const sub = await subService.subscribe(req.userId, req.body.plan);
  successResponse(res, "تم الاشتراك بنجاح", { subscription: sub }, 201);
});

export const getActiveSubscription= catchAsync(async (req, res) => {
  const sub = await subService.getActiveSubscription(req.userId);
  successResponse(res, "تم جلب الاشتراك", { subscription: sub });
});

export const cancelSubscription   = catchAsync(async (req, res) => {
  await subService.cancelSubscription(req.userId);
  successResponse(res, "تم إلغاء الاشتراك بنجاح");
});
