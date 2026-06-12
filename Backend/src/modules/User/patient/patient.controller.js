import { successResponse } from "../../../shared/utils/ApiResponse.js";
import catchAsync from "../../../shared/utils/catchAsync.js";

import * as patientServers from "../user.service.js";

import * as patientServers from "./patient.service.js";

const getProfile = catchAsync(async (req, res) => {
  const user = await patientServers.getProfile(req.userId);
  successResponse(res, "User profile data", { userData: user });
});

const updateProfile = catchAsync(async (req, res) => {
  await patientServers.updateProfile(req.userId, req.body, req.file);
  successResponse(res, "Profile update successfully");
});

const bookAppointment = catchAsync(async (req, res) => {});

const listAppointment = catchAsync(async (req, res) => {});

const cancelAppointment = catchAsync(async (req, res) => {});
const getReport = catchAsync(async (req, res) => {});

const getAllConsultations = catchAsync(async (req, res) => {});
const updateConsultationTime = catchAsync(async (req, res) => {});
const cancelConsultation = catchAsync(async (req, res) => {});

const getUserStats = catchAsync(async (req, res) => {});

const bookAppointment = catchAsync(async (req, res) => {
  const appointment = await patientServers.bookAppointment(
    req.userId,
    req.body,
  );
  successResponse(
    res,
    "The book appointment successfully",
    { appointment },
    201,
  );
});

const listAppointment = catchAsync(async (req, res) => {
  const appointment = await patientServers.listAppointment(req.userId);
  successResponse(res, "Done Get All Appointments", { appointment });
});

const cancelAppointment = catchAsync(async (req, res) => {
  const cancelAppointment = await patientServers.cancelAppointment(
    req.userId,
    req.body.appointmentId,
  );
  successResponse(req, "Appointment cancel appointment Done", {
    cancelAppointment,
  });
});
const getReport = catchAsync(async (req, res) => {
  const reports = await patientServers.getReport(req.userId);
  successResponse(req, "Get All Report Done", { reports });
});

const getAllConsultations = catchAsync(async (req, res) => {
  const consultation = await patientServers.getAllConsultations(req.userId);
  successResponse(res, "Get All Consultation", { consultation });
});

const getConsultation = catchAsync(async (req, res) => {
  const consultation = await patientServers.getConsultation(
    req.userId,
    req.body,
  );
  successResponse(res, "Get  Consultation", { consultation });
});
const updateConsultationTime = catchAsync(async (req, res) => {
  const consultation = await patientServers.updateConsultationTime(
    req.userId,
    req.body,
  );
  successResponse(res, "the consultation time updated success", {
    consultation,
  });
});
const cancelConsultation = catchAsync(async (req, res) => {
  const consultation = await patientServers.cancelConsultation(
    req.userId,
    req.body,
  );
  successResponse(res, "The Consultation canceled success");
});

const getUserStats = catchAsync(async (req, res) => {
  const stats = await patientServers.getUserStats(req.userId);
  successResponse(res, "Get All User Stats ", { stats });
});

export {
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  getReport,
  getAllConsultations,
  getConsultation,
  updateConsultationTime,
  cancelConsultation,
  getUserStats,
};
