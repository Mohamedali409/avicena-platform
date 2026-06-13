import {
  deleteCache,
  getCache,
  setCache,
} from "../../infrastructure/redis/cache.service";
import * as doctorRepository from "./doctor.repository.js";
import * as appointmentRepository from "../appointments/appointment.repository.js";

import * as consultationRepository from "../consultations/consultation.repository.js";

import * as reportRepository from "../report/report.repository.js";
import ApiError from "../../shared/utils/ApiError.js";
import { removeSlot } from "../../shared/utils/slots.utils.js";
import { sendReportEmail } from "../../infrastructure/mail/mail.service.js";
const TTL = 120;

// ── Public ────────────────────────────────────────────
const getDoctorList = async () => {
  const cached = await getCache("doctors:list");
  if (cached) return cached;
  const doctors = await doctorRepository.findDoctorActive();
  await setCache("doctors:list", doctors, 60);
  return doctors;
};

// ── Profile ───────────────────────────────────────────
const getProfile = async (docId) => {
  const cached = await getCache(`doctor:${docId}:profile`);
  if (cached) return cached;
  const doctor = await doctorRepository.findDoctorById(docId);
  await setCache(`doctor:${docId}:profile`);
  return doctor;
};

const updateProfile = async (
  docId,
  { fees, consultation_fees, address, available, phone, start_booked },
) => {
  await doctorRepository.findDoctorAndUpdate(docId, {
    fees,
    consultation_fees,
    address: typeof address === "string" ? JSON.parse(address) : address,
    available,
    phone,
    start_booked:
      typeof start_booked === "string"
        ? JSON.parse(start_booked)
        : start_booked,
  });

  await deleteCache(`doctor:${docId}:profile`);
};

// ── Appointments ──────────────────────────────────────
const getAppointments = async (docId) => {
  const cached = await getCache(`doctor:${docId}:appointment`);
  if (cached) return cached;
  const appointments =
    await appointmentRepository.findAppointmentByDoctorId(docId);

  await setCache(`doctor:${docId}:appointment`, appointments, TTL);
  return appointments;
};

const completeAppointment = async (docId, appointmentId) => {
  const appointment = await appointmentRepository.findById(appointmentId);
  if (!appointment || appointment.docId.toString() !== docId)
    throw new ApiError("Not Authorization", 403);

  await appointmentRepository.completeAppointment(appointmentId);

  const slots = removeSlot(
    (await doctorRepository.findDoctorById(docId)).slots_booked,
    appointment.slotDate,
    appointment.slotTime,
  );
  await doctorRepository.findDoctorAndUpdate(docId, { slots_booked: slots });
  await deleteCache(`doctor:${docId}:appointments`);
};

const cancelAppointment = async (docId, appointmentId) => {
  const appointment =
    await appointmentRepository.findAppointmentById(appointmentId);
  if (!appointment || appointment.docId.toString() !== docId)
    throw new ApiError("Not Authorization", 403);

  await appointmentRepository.cancelAppointment(appointmentId);
  const slots = removeSlot(
    (await doctorRepository.findDoctorById(docId)).slots_booked,
    appointment.slotDate,
    appointment.slotTime,
  );
  await doctorRepository.findDoctorAndUpdate(docId, { slots_booked: slots });
  await deleteCache(`doctor:${docId}:appointments`);
};

// ── Reports ───────────────────────────────────────────
const addReport = async (docId, body) => {
  const {
    appointmentId,
    complaint,
    examination,
    diagnosis,
    treatment,
    notes,
    nextVisit,
  } = body;

  if (!complaint || !examination || !diagnosis || !treatment)
    throw new ApiError("All filed is required", 400);

  const appointment = await appointmentRepository.findById(appointmentId);
  if (!appointment) throw new ApiError("The appointment not found", 404);
  if (!appointment.isCompleted || appointment.cancelled)
    throw new ApiError(
      "You cant write this report not completed or canceled",
      400,
    );

  const todayVisit = new Date(appointment.slotDate);
  if (nextVisit && new Date(nextVisit) <= todayVisit) {
    throw new ApiError("the new visit must be before today visit", 400);
  }
  const report = await reportRepository.createReport({
    complaint,
    examination,
    diagnosis,
    notes,
    nextVisit,
    treatment: Array.isArray(treatment) ? treatment : JSON.parse(treatment),
    userData: appointment.userData,
    docData: appointment.docData,
    appointmentData: appointment,
  });

  sendReportEmail(appointment.userData.email, report).catch(console.error);
  return report;
};

const getAllReports = async (docId) => {
  const cached = await getCache(`doctor:${docId}:reports`);
  if (cached) return cached;

  const reports = await reportRepository.getReportWithDoctor(docId);
  await setCache(`doctor:${docId}:reports`, reports, TTL);
  return reports;
};

const getUserReports = async (docId, userId) => {
  const cached = await getCache(`doctor:${docId}:user:${userId}::reports`);
  if (cached) return cached;
  const reports = await reportRepository.getReportWithDoctorAndUser(
    docId,
    userId,
  );
  await setCache(`doctor:${docId}:user:${userId}::reports`, reports, TTL);
  return reports;
};

const editReport = async (docId, reportId, body) => {
  const report = await reportRepository.getReportById(reportId);
  if (!report) throw new ApiError("The report not found", 404);
  if (report.docId.toString() !== docId)
    throw new ApiError("Not Authorization for you", 403);

  const { complaint, examination, diagnosis, treatment, notes, nextVisit } =
    body;

  await reportRepository.updateReport(reportId, {
    complaint,
    examination,
    diagnosis,
    treatment,
    notes,
    nextVisit,
  });

  await deleteCache(`doctor:${docId}:reports`);
};

const deleteReport = async (docId, reportId) => {
  const report = await reportRepository.getReportById(reportId);
  if (!report) throw new ApiError("The report not found", 404);
  if (report.docId.toString() !== docId)
    throw new ApiError("Not Authorization for you", 403);

  await reportRepository.removeReport(reportId);
  await deleteCache(`doctor:${docId}:reports`);
};

// ── Consultations ─────────────────────────────────────
const createConsultation = async (docId, body) => {
  const { userId, consultDay, notes, appointmentId, amount } = body;

  if (!consultDay) throw new ApiError("Please select consultation day", 400);

  const appointment =
    await appointmentRepository.findAppointmentById(appointmentId);

  if (!appointment) throw new ApiError("This time not found ", 404);
  if (
    appointment.docId.toString() !== docId ||
    appointment.userId.toString() !== userId
  )
    throw new ApiError("This time not avilabily to this doctor or user", 400);

  if (!appointment.isCompleted)
    throw new ApiError("This appointment not completed yet", 400);

  if (appointment.cancelled)
    throw new ApiError("This appointment is cancelled", 400);

  const [appDay, apptMonth, apptYear] = appointment.slotDate.split("-");
  const appointmentDate = new Date(`${apptYear}-${apptMonth}-${appDay}`);

  if (new Date(consultDay) <= appointmentDate)
    throw new ApiError("The consultation day must be After appointment day");

  return consultationRepository.createConsultation({
    userId,
    docId,
    consultDay,
    notes,
    appointmentId,
    amount,
    appointmentDate: appointment,
    userData: appointment.userData,
    docData: appointment.docData,
  });
};

const getConsultations = async (docId) => {
  const cached = await getCache(`doctor"${docId}:consultations`);
  if (cached) return cached;

  const consultations =
    await consultationRepository.getDoctorConsultations(docId);

  await setCache(`doctor:${docId}:consultations`, consultations, TTL);
  return consultations;
};

const completeConsultation = async (docId, { consultationId, userId }) => {
  const consultation = await consultationRepository.findById(consultationId);
  if (
    !consultation ||
    !consultation.docId.equals(docId) ||
    !consultation.userId.equals(userId)
  )
    throw new ApiError("Not Authorization for you", 403);

  await consultationRepository.completeConsultation(consultationId);
};

const cancelConsultation = async (docId, { consultationId, userId }) => {
  const consultation = await consultationRepository.findById(consultationId);
  if (
    !consultation ||
    !consultation.docId.equals(docId) ||
    !consultation.userId.equals(userId)
  )
    throw new ApiError("Not Authorization for you", 403);

  await consultationRepository.cancelConsultation(consultationId);
};

// ── Dashboard ─────────────────────────────────────────
const getDashboard = async (docId) => {
  const cached = await getCache(`doctor:${docId}:dashboard`);
  if (cached) return cached;

  const [appointments, consultations] = await Promise.all([
    appointmentRepository.findAppointmentByDoctorId(docId),
    consultationRepository.getDoctorConsultations(docId),
  ]);

  const earnings_appointments = appointments
    .filter((a) => a.isCompleted || a.payment)
    .reduce((sum, a) => sum + a.amount, 0);

  const earnings_consultations = consultations
    .filter((c) => c.isCompleted || c.payment)
    .reduce((sum, c) => sum + c.amount, 0);

  const uniquePatients = [
    ...new Set(appointments.map((a) => a.userId.toString())),
  ];
  const uniqueConsultationsPatients = [
    ...new Set(consultations.map((c) => c.userId.toString())),
  ];

  const dashboard = {
    earnings_appointments,
    earnings_consultations,
    appointments: appointments.length,
    patients: uniquePatients.length,
    consultations_patients: uniqueConsultationsPatients.length,
    lastAppointments: [...appointments].reverse().slice(0, 3),
    lastConsultations: [...consultations].reverse().slice(0, 3),
  };

  await setCache(`doctor:${docId}:dashboard`, dashboard, TTL);
  return dashboard;
};

// ── Search ─────────────────────────────────────────────

// ── Slots ─────────────────────────────────────────────

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
};
