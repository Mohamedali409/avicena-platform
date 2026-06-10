import {
  deleteCache,
  getCache,
  setCache,
} from "../../infrastructure/redis/cache.service";
import * as doctorRepository from "./doctor.repository.js";
import * as appointmentRepository from "../appointments/appointment.repository.js";
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
};
