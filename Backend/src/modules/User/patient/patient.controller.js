import { successResponse } from "../../../shared/utils/ApiResponse.js";
import catchAsync from "../../../shared/utils/catchAsync.js";
import * as patientServers from "../user.service.js";
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

export {
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  getReport,
  getAllConsultations,
  updateConsultationTime,
  cancelConsultation,
  getUserStats,
};
