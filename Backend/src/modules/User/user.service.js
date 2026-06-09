import {
  deleteCache,
  getCache,
  setCache,
} from "../../infrastructure/redis/cache.service.js";
import { uploadImage } from "../../infrastructure/storage/cloudinary.service.js";
import ApiError from "../../shared/utils/ApiError.js";
import * as userRepository from "./user.repository.js";
import * as doctorRepository from "../doctors/doctor.repository.js";
import * as appointmentRepository from "../appointments/appointment.repository.js";
import * as reportRepository from "../report/report.repository.js";
import * as consultationRepository from "../consultations/consultation.repository.js";
import {
  addSlot,
  isSlotTaken,
  removeSlot,
} from "../../shared/utils/slots.utils.js";
import { sendAppointmentEmail, sendConsultationEmail } from "../../infrastructure/mail/mail.service.js";

const CACHE_TTL = 120;

// ──── Profile ───────────────────────────────────────────
const getProfile = async (userId) => {
  const cached = await getCache(`user:${userId}:profile`);

  if (cached) return cached;

  const user = await userRepository.getUserById(userId);
  if (!user) throw new ApiError("User not found", 404);

  await setCache(`user:${userId}:profile`, user, CACHE_TTL);
  return user;
};

const updateProfile = async (userId, body, imageFile) => {
  const { name, phone, address, gender, dob, nationality, nationalId } = body;

  if (!name || !phone || !gender || !dob || !nationality || !nationalId) {
    throw new ApiError("All file is required", 400);
  }
  if (String(nationalId).length !== 14) {
    throw new ApiError("The national id must be bigger than 14 number", 400);
  }
  const duplicate = await userRepository.findByNationalId(nationalId);
  if (duplicate && duplicate._id.toString() !== userId)
    throw new ApiError("The national id is duplicated", 409);

  const update = {
    name,
    phone,
    gender,
    dob,
    nationalId,
    nationality,
    address: typeof address === "string" ? JSON.parse(address) : address,
  };

  if (imageFile)
    update.image = await uploadImage(imageFile.path, "avicena/users");

  await userRepository.updateUserById(userId, update);
  await deleteCache(`user:${userId}:profile`);
};

// ──── Appointment ───────────────────────────────────────────
const bookAppointment = async (userId, { docId, slotDate, slotTime }) => {
  if (!slotDate) throw new ApiError("Please choose a good date for you", 400);
  if (!slotTime) throw new ApiError("Please choose a good Time for you", 400);

  const doctor = await doctorRepository.findDoctorById(docId);
  if (!doctor) throw new ApiError("The Doctor not found", 404);
  if (!doctor.available) throw new ApiError("The doctor available now", 400);
  if (isSlotTaken(doctor.slots_booked, slotDate, slotTime)) {
    throw new ApiError("This Time not available now");
  }

  const user = await userRepository.getUserById(userId);

  const slots_booked = addSlot(doctor.slots_booked, slotDate, slotTime);
  await doctorRepository.findDoctorAndUpdate(docId, { slots_booked });

  const docData = doctor.toObject();
  delete docData.slots_booked;
  delete docData.password;

  const appointment = await appointmentRepository.createAppointment({
    userId,
    docId,
    userData: user,
    docData,
    slotDate,
    slotTime,
    amount: doctor.fees,
  });

  sendAppointmentEmail(user.email, user.name, appointment, docData).catch(
    console.error,
  );
  return appointment;
};

const listAppointment = async (userId) => {
  const cached = await getCache(`user:${userId}:appointments`);
  if (cached) return cached;

  const appointment =
    await appointmentRepository.findAllAppointmentByUserId(userId);

  await setCache(`user:${userId}:appointments`, appointment, CACHE_TTL);
  return appointment;
};

const cancelAppointment = async (userId, appointmentId) => {
  const appointment =
    await appointmentRepository.findAppointmentById(appointmentId);
  if (!appointment) throw new ApiError("The appointment not found", 404);
  if (appointment.userId.toString() !== userId)
    throw new ApiError(" not autrizeded to canceled the appointment", 403);
  if (appointment.cancelled)
    throw new ApiError("the appointment is canceled before", 400);

  await appointmentRepository.findAppointmentByIdAndUpdate(appointment, {
    cancelled: true,
  });

  const doctor = await doctorRepository.findDoctorById(appointment.docId);
  const slots_booked = removeSlot(
    doctor.slots_booked,
    appointment.slotDate,
    appointment.slotTime,
  );
  await doctorRepository.findDoctorAndUpdate(appointment.docId, {
    slots_booked,
  });

  await deleteCache(`user:${userId}:appointments`);
};

// ──── Report ───────────────────────────────────────────
const getReport = async (userId) => {
  const cached = await getCache(`user:${userId}:reports`);
  if (cached) return cached;

  const reports = await reportRepository.findReportByUserId(userId);
  await setCache(`user:${userId}:report`, reports, CACHE_TTL);

  return reports;
};

// ──── consultations ───────────────────────────────────────────
const getAllConsultations = async (userId) => {
  const cached = await getCache(`user:${userId}":consultations`);
  if (cached) return cached;

  const consultations =
    await consultationRepository.findAllConsultationsByUserId(userId);

  await setCache(`user:${userId}:consultations`, consultations, CACHE_TTL);
  return consultations;
};

const getConsultation = async (userId , {appointmentId , docId}) =>{
  const cache = await getCache(`user:${userId}:consultation:${appointmentId}`)
  if(cache) return cache

  const data = await consultationRepository.getConsultation(appointmentId , docId , userId)
  if(!data) throw new ApiError("the doctor not selected consultation time" , 404)
  
  await setCache(`user:${userId}:consultation:${appointmentId}`, CACHE_TTL)
  return data 
}

const updateConsultationTime = async (userId , {consultationId , consultTime})=>{
  const consultation =  await consultationRepository.findById(consultationId)
  if(!consultation) throw new ApiError("consultation not found" , 404)
  if(consultation.userId.toString() !== userId){
    throw new ApiError("not authrizred" , 403)
  }
  const {consultDay , docId} = consultation
  const doctor = await doctorRepository.findDoctorById(docId)

  if(isSlotTaken(doctor.slots_booked, consultDay , consultTime)){
    throw new ApiError("This time not avalibaily" , 400)
  }

  const appointmentConflict = await appointmentRepository.getAppointment(docId,consultDay , consultTime)

  if(appointmentConflict) throw new ApiError("This time is booked for anther time , please choose anther time", 400)

    const consultationConflict =  await consultationRepository.getConsultationConflict(docId , consultDay , consultTime , consultationId)

    if(consultationConflict) throw new ApiError("This time is booked, please choose anther time",400 )

      const slots_booked = addSlot(doctor.slots_booked, consultDay , consultTime)
      await doctorRepository.findDoctorAndUpdate(docId , {slots_booked})
      await consultationRepository.findConsultationAndUpdate(consultationId , consultTime)

      sendConsultationEmail(
        consultation.userData.email,
        consultation.userData.name,
        consultation.docData,
        consultDay,
        consultTime,
        consultation.notes
      ).catch(console.error)

}

const cancelConsultation = async (userId ,{consultationId , docId}) =>{
  const consultation = await consultationRepository.findById(consultationId)
  if(!consultation) throw new ApiError("This Consultation Is Booked, please choose anther Time" , 400)
  if(!consultation.userId.equals(userId) || !consultation.docId.equals(docId)){
    throw new ApiError("not authrization to choose time" , 403)
  }

  const cancelled = true;
  await consultationRepository.findConsultationAndUpdate(consultation , cancelled )

  const doctor = await doctorRepository.findDoctorById(docId)
  const slots_booked = removeSlot(
    doctor.slots_booked,
    consultation.consultDay,
    consultation.consultTime
  )
  await doctorRepository.findDoctorAndUpdate(docId , slots_booked)

  await deleteCache(`user:${userId}:consultations`)
}


// ──── Dashboard stats ───────────────────────────────────────────
export const getUserStats = async (userId) =>{
  const cached =  await getCache(`user:${userId}:stats`)
  if(cached) return cached

  const [appointments , reports , consultations] = await Promise.all([
    appointmentRepository.getAppointmentCountDocumentsByUserId(userId),
    reportRepository.getReportCountDocumentsByUserId(userId),
    consultationRepository.getConsultationCountDocumentsByUserId(userId)
  ])

  const stats = {appointments , reports , consultations}
  await setCache(`user:${userId}:stats` , stats , CACHE_TTL)
  return stats
}

const 
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
  getUserStats

};
