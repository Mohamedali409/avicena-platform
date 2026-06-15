import User from "../user.model.js";
import Doctor from "../../doctors/doctor.model.js";
import catchAsync from "../../../shared/utils/catchAsync.js";
import * as adminService from "./admin.service.js";
import { successResponse } from "../../../shared/utils/ApiResponse.js";
// const createDoctor = (doctorData) => {
//   return Doctor.create(doctorData);
// };

// Dashboard
const getDashboard = catchAsync(async (req, res) => {
  const data = await adminService.getDashboard();
  successResponse(res, "Done Get Dashboard success", { doshData: data });
});

// Doctor
const addDoctor = catchAsync(async (req, res) => {
  await adminService.addDoctor(req.body, req.file);
  successResponse(req, "Doctor added success", {}, 201);
});

const getDoctors = catchAsync(async (req, res) => {
  const doctors = await adminService.getDoctors();
  successResponse(res, "Done get All Doctor", { doctors });
});

const removeDoctor = catchAsync(async (req, res) => {
  await adminService.removeDoctor(req.body.docId);
  successResponse(res, "Doctor removed success");
});

const toggleAvailability = catchAsync(async (req, res) => {
  await adminService.toggleDoctorAvailability(req.body, docId);
  successResponse(res, "Doctor status updated success");
});

// Appointment
const getAllAppointments = catchAsync(async (req, res) => {
  const appointments = await adminService.getAllAppointment();
  successResponse(res, "Get all appointments", { appointments });
});

const canceledAppointment = catchAsync(async (req, res) => {
  await adminService.cancelAppointment(req.body.appointmentId);
  successResponse(req, "appointment done canceled ");
});

const getUserAppointment = catchAsync(async (req, res) => {
  const appointments = await adminService.getUserAppointment(req.body.userId);
  successResponse(res, "Done get All user appointments", { appointments });
});

const completeAppointment = catchAsync(async (req, res) => {
  await adminService.completeAppointment(req.body);
  successResponse(res, "The Appointment Completed success");
});

// Consultation

const getAllConsultations = catchAsync(async (req, res) => {
  const consultations = await adminService.getAllConsultation();
  successResponse(res, "All Consultation get success");
});

const getUserConsultation = catchAsync(async (req, res) => {
  const userConsultation = await adminService.getUserConsultation(
    req.body.userId,
  );
  successResponse(res, "Done get user consultations");
});

const cancelConsultation = catchAsync(async (req, res) => {
  await adminService.cancelConsultation(req.body);
  successResponse(res, "The consultation canceled success");
});

const completeConsultation = catchAsync(async (req, res) => {
  await adminService.completeConsultation(req.body);
  successResponse(res, "The consultation completed success");
});

// Report
const getAllReports = catchAsync(async (req, res) => {
  const reports = await adminService.getAllReports();
  successResponse(res, "All reports ", { reports });
});

const getUserReports = catchAsync(async (req, res) => {
  const reports = await adminService.getAllReports();
  successResponse(req, "Done get all user reports", { reports });
});

const deleteReport = catchAsync(async (req, res) => {
  await adminService.deleteReport(req.body.reportId);
  successResponse(res, "Done Deleted report");
});

const editReport = catchAsync(async (req, res) => {
  await adminService.editReport(req.body.reportId, req.body);
  successResponse(res, "Done edit the Report");
});

// Users
const getAllUsers = catchAsync(async (req, res) => {
  const users = await adminService.getAllUsers();
  successResponse(res, "Get all users", { users });
});

const searchUsers = catchAsync(async (req, res) => {
  const users = await adminService.searchUsers(req.body.q);
  successResponse(res, "Search result", { users });
});

const toggleUserStatus = catchAsync(async (req, res) => {
  await adminService.toggleUserStatus(req.body.userId);
  successResponse(res, "The user states updated success");
});

export {
  getDashboard,
  addDoctor,
  getDoctors,
  removeDoctor,
  toggleAvailability,
  getAllAppointments,
  canceledAppointment,
  getUserAppointment,
  completeAppointment,
  getAllConsultations,
  getUserConsultation,
  cancelConsultation,
  completeConsultation,
  getAllReports,
  getUserReports,
  deleteReport,
  editReport,
  getAllUsers,
  searchUsers,
  toggleUserStatus,
};

// get all appointment

export {};
