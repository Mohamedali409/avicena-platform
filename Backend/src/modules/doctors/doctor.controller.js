import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/ApiResponse.js";
import * as doctorService from "./doctor.service.js";

// Publish
const getDoctorList = catchAsync(async (req, res) => {
  const doctor = await doctorService.getDoctorList();
  successResponse(res, "Get all doctors", { doctor });
});

// Profile
const getProfile = catchAsync(async (req, res) => {
  const doctorInfo = await doctorService.getProfile(req.docId);
  successResponse(res, "Doctor Profile ", { doctorInfo });
});

const updateProfile = catchAsync(async (req, res) => {
  await doctorService.updateProfile(req.docId, req.body);
  successResponse(res, "Profile updated success");
});

// Appointments
const getAppointments = catchAsync(async (req, res) => {
  const appointments = await doctorService.getAppointments(req.docId);
  successResponse(res, "Doctor Appointments ", { appointments });
});

const completeAppointment = catchAsync(async (req, res) => {
  await doctorService.completeAppointment(req.docId, req.body.appointmentId);
  successResponse(res, "Appointment Completed done");
});

const cancelAppointment = catchAsync(async (req, res) => {
  await doctorService.cancelAppointment(req.docId, req.body.appointmentId);
  successResponse(res, "Appointment Completed done");
});

// Reports
const addReport = catchAsync(async (req, res) => {
  const report = await doctorService.addReport(req.docId, req.body);
  successResponse(res, "Report Added success", { report }, 201);
});

const getAllReports = catchAsync(async (req, res) => {
  const reports = await doctorService.getAllReports(req.docId);
  successResponse(res, "Done get all reports ", { reports });
});

const getUserReports = catchAsync(async (req, res) => {
  const userReport = await doctorService.getUserReports(
    req.docId,
    req.body.userId,
  );
  successResponse(res, "Dene get All reports for user ");
});

const editReport = catchAsync(async (req, res) => {
  await doctorService.editReport(req.docId, req.body.reportId, req.body);
  successResponse(res, "done edit report");
});

const deleteReport = catchAsync(async (req, res) => {
  await doctorService.deleteReport(req.docId, req.body.reportId);
  successResponse(res, "Done Deleted report");
});

// Consultation
const createConsultation = catchAsync(async (req, res) => {
  const consultation = await doctorService.createConsultation(
    req.docId,
    req.body,
  );
  successResponse(res, "Done Created Consultation", { consultation }, 201);
});

const getConsultations = catchAsync(async (req, res) => {
  const consultations = await doctorService.getConsultations(req.docId);
  successResponse(res, "Done get all doctor consultations");
});

const completeConsultation = catchAsync(async (req, res) => {
  await doctorService.completeConsultation(req.docId, req.body);
  successResponse(res, "Done get completed consultation");
});

const cancelConsultation = catchAsync(async (req, res) => {
  await doctorService.cancelConsultation(req.docId, req.body);
  successResponse(res, "Done get canceled consultation");
});

// Dashboard
const getDashboard = catchAsync(async (req, res) => {
  const dashData = await doctorService.getDashboard(req.docId);
  successResponse(res, "Done get dashboard data", { dashData });
});

// Search and Utilities
const searchPatients = catchAsync(async (req, res) => {
  const user = await doctorService.searchPatients(req.docId, req.body.q);
  successResponse(res, "search result ", { user });
});

const clearSlots = catchAsync(async (req, res) => {
  await doctorService.clearDoctorSlots(req.docId);
  successResponse(res, "Done clear all slots is appointments");
});

const getPatientStats = catchAsync(async (req, res) => {
  const stats = await doctorService.getPatientStats(req.body.userId);
  successResponse(res, "Done get all patient data ", { stats });
});

export {
  getDoctorList,
  getProfile,
  updateProfile,
  getAppointments,
  completeAppointment,
  cancelAppointment,
  addReport,
  getAllReports,
  getUserReports,
  editReport,
  deleteReport,
  createConsultation,
  getConsultations,
  completeConsultation,
  cancelConsultation,
  getDashboard,
  searchPatients,
  clearSlots,
  getPatientStats,
};
