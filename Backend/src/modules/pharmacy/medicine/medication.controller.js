import { successResponse } from "../../../shared/utils/ApiResponse.js";
import catchAsync from "../../../shared/utils/catchAsync.js";
import * as medicationService from "./medication.service.js";

const createSchedule = catchAsync(async (req, res) => {
  const result = await medicationService.createSchedule(req.userId, req.body);
  successResponse(res, "تم إنشاء جدول الدواء وجدولة التذكيرات", result, 201);
});

const createFromReport = catchAsync(async (req, res) => {
  const result = await medicationService.createFromReport(
    req.userId,
    req.params.reportId,
    req.body,
  );
  successResponse(res, "تم إنشاء الجدول من التقرير", result, 201);
});

const listSchedules = catchAsync(async (req, res) => {
  const schedules = await medicationService.listSchedules(req.userId);
  successResponse(res, "جداول الأدوية", { schedules });
});

const stopSchedule = catchAsync(async (req, res) => {
  const schedule = await medicationService.stopSchedule(
    req.userId,
    req.params.id,
  );
  successResponse(res, "تم إيقاف التذكيرات", { schedule });
});

export { createSchedule, createFromReport, listSchedules, stopSchedule };
