import ApiError from "../../../shared/utils/ApiError.js";
import * as medicationRepository from "./medication.repository.js";
import { scheduleForPlan } from "../../../infrastructure/queue/medication.queue.js";
import { getReportById } from "../../report/report.repository.js";

// Default reminder times by doses-per-day, used when building a plan straight
// from a report where the doctor only wrote free-text dosage.
const DEFAULT_TIMES = {
  1: ["09:00"],
  2: ["09:00", "21:00"],
  3: ["08:00", "14:00", "20:00"],
  4: ["08:00", "12:00", "16:00", "20:00"],
};

const createSchedule = async (userId, body) => {
  const { medications, reportId, channels } = body;
  if (!Array.isArray(medications) || !medications.length)
    throw new ApiError("لا توجد أدوية في الجدول", 400);

  const normalized = medications.map((m) => ({
    name: m.name,
    dosage: m.dosage || "",
    times:
      Array.isArray(m.times) && m.times.length
        ? m.times
        : DEFAULT_TIMES[Number(m.dosesPerDay)] || DEFAULT_TIMES[1],
    startDate: m.startDate ? new Date(m.startDate) : new Date(),
    days: Number(m.days) || 1,
  }));

  const schedule = await medicationRepository.create({
    userId,
    reportId: reportId || null,
    medications: normalized,
    channels: channels || { inApp: true, email: true },
    active: true,
  });

  const count = await scheduleForPlan(schedule);
  return { schedule, remindersScheduled: count };
};

const createFromReport = async (userId, reportId, overrides = {}) => {
  const report = await getReportById(reportId);
  if (!report) throw new ApiError("التقرير غير موجود", 404);
  if (String(report.userId) !== String(userId))
    throw new ApiError("غير مصرح لك", 403);

  const medications = (report.treatment || []).map((t) => ({
    name: t.name,
    dosage: t.dosage || "",
    times: DEFAULT_TIMES[Number(overrides.dosesPerDay)] || DEFAULT_TIMES[2],
    startDate: new Date(),
    days: Number(overrides.days) || 7,
  }));

  return createSchedule(userId, { medications, reportId });
};

const listSchedules = (userId) => medicationRepository.findByUser(userId);

const stopSchedule = async (userId, id) => {
  const schedule = await medicationRepository.setActive(id, userId, false);
  if (!schedule) throw new ApiError("الجدول غير موجود", 404);
  return schedule;
};

export { createSchedule, createFromReport, listSchedules, stopSchedule };
