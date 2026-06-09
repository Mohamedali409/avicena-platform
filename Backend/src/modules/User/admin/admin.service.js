import * as userRepository from "../user.repository.js";
import * as doctorRepository from "../../doctors/doctor.repository.js";
import * as appointmentRepository from "../../appointments/appointment.repository.js";
import * as consultationRepository from "../../consultations/consultation.repository.js";
import * as reportRepository from "../../report/report.repository.js";
import * as labRepository from "../../labs/labs.repository.js";
import ApiError from "../../../shared/utils/ApiError.js";
import { uploadImage } from "../../../infrastructure/storage/cloudinary.service.js";
import { removeSlot } from "../../../shared/utils/slots.utils.js";

// ── Dashboard ─────────────────────────────────────────
const getDashboard = async () => {
  const [doctors, users, appointments, consultations, reports, labs] =
    await Promise.all([
      doctorRepository.getDoctorCountDocuments(),
      userRepository.getUserCountDocuments(),
      appointmentRepository.getAppointmentCountDocuments(),
      consultationRepository.getConsultationCountDocuments(),
      reportRepository.getReportCountDocuments(),
      labRepository.getLabCountDocuments(),
    ]);

  const [lastAppointment, lastConsultation] = await Promise.all([
    appointmentRepository.lastAppointment(),
    consultationRepository.lastConsultation(),
  ]);

  return {
    doctors,
    users,
    appointments,
    consultations,
    reports,
    labs,
    lastAppointment,
    lastConsultation,
  };
};

// ── Doctor CRUD ─────────────────────────────────────────
const addDoctor = async (body, imageFile) => {
  const {
    name,
    email,
    password,
    speciality,
    degree,
    experience,
    about,
    fees,
    address,
    phone,
    start_booked,
    consultation_fees,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !speciality ||
    !degree ||
    !experience ||
    !about ||
    !fees ||
    !address ||
    !phone ||
    !start_booked ||
    !consultation_fees
  )
    throw new ApiError("All Filed is required", 400);

  if (!validator.isEmail(email)) throw new ApiError("The Email not valid", 400);
  if (password.length < 8)
    throw new ApiError("the password must be bagger than 8 words", 400);
  if (!imageFile) throw new ApiError("the doctor image is required", 400);

  const exists = await doctorRepository.findDoctorByEmail(email);
  if (exists) throw new ApiError("The Email is user before", 409);

  const slat = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, slat);
  const imageUrl = await uploadImage(imageFile.path, "avicena/doctors");

  await doctorRepository.createDoctor({
    name,
    email,
    password: hashed,
    image: imageUrl,
    speciality,
    degree,
    experience,
    about,
    fees: Number(fees),
    consultation_fees: Number(consultation_fees),
    start_booked:
      typeof start_booked === "string"
        ? JSON.parse(start_booked)
        : start_booked,
    address: typeof address === "string" ? JSON.parse(address) : address,
    date: Date.now(),
  });
};

const getDoctors = async () => {
  const doctors = await doctorRepository.getDoctors();
  return doctors;
};

const removeDoctor = async (docId) => {
  const doc = await doctorRepository.removeDoctor(docId);
  if (!doc) throw new ApiError("This Doctor Not Found", 404);
};

const toggleDoctorAvailability = async (docId) => {
  const doc = await doctorRepository.findDoctorById(docId);
  if (!doc) throw new ApiError("The Doctor Not Found", 404);
  const newDoctorState = await doctorRepository.findDoctorAndUpdate(docId, {
    available: !doc.available,
  });
  return newDoctorState;
};

// ── Appointments ──────────────────────────────────────
const getAllAppointment = async () => {
  return appointmentRepository.getAppointments();
};

const getUserAppointment = async (userId) =>{
    return await appointmentRepository.findAllAppointmentByUserId(userId)
}

const cancelAppointment = async (appointmentId) => {
  const appointment =
    await appointmentRepository.findAppointmentById(appointmentId);
  if (!appointment) throw new ApiError("The Appointment not Found", 404);

  await appointmentRepository.cancelAppointment(appointmentId, {
    cancelled: true,
  });

  const doctor = await doctorRepository.findDoctorById(appointment.docId);
  if (doctor) {
    const slots = removeSlot(
      doctor.slots_booked,
      appointment.slotDate,
      appointment.slotTime,
    );
    return await doctorRepository.findDoctorAndUpdate(appointment.docId, {
      slots_booked: slots,
    });
  }
};

// ── Consultations ─────────────────────────────────────

const getAllConsultation = async (consultationId) => {
  return await consultationRepository.getConsultations();
};

const getUserConsultation = async (userId) => {
  const userConsultation =
    await consultationRepository.findAllConsultationsByUserId(userId);
  return userConsultation;
};

const cancelConsultation = async ({ consultationId, userId, docId }) => {
  const consultation = await consultationRepository.findById(consultationId);
  if (!consultation) throw new ApiError("The Consultation Not Found", 404);
  if (
    !consultation.docId.equals(docId) ||
    !consultation.userId.equals(userId)
  ) {
    throw new ApiError("البيانات غير متطابقة", 400);
  }

  await consultationRepository.cancelConsultation(consultationId);

  const doctor = await doctorRepository.findDoctorById(docId);
  if (doctor && consultation.consultTime) {
    const slots = removeSlot(
      doctor.slots_booked,
      consultation.consultDay,
      consultTime,
    );
    return await doctorRepository.findDoctorAndUpdate(docId, {
      slots_booked: slots,
    });
  }
};

const completeConsultation = async ({ consultationId, userId, docId }) => {
  const consultation = await consultationRepository.findById(consultationId);
  if (!consultation) throw new ApiError("The Consultation Not Found", 404);
  if (
    !consultation.docId.equals(docId) ||
    !consultation.userId.equals(userId)
  ) {
    throw new ApiError("The date is not equals", 400);
  }

  return await consultationRepository.completeConsultation(consultationId);
};

// ── Reports ───────────────────────────────────────────

const getAllReports = async () => {
  return await reportRepository.getReports();
};

const getUserReports = async (userId) => {
  return await reportRepository.findReportByUserId(userId);
};

const deleteReport = async (reportId)=>{
    const report = await reportRepository.removeReport(reportId)
    if(!report) throw new ApiError("The Report Is Not Found" , 404)
}

const editReport = async (reportId , body)=>{
    const {complaint , examination , diagnosis , treatment , notes , nextVisit} = body

    const report = await reportRepository.getReportById(reportId)
    if(!report) throw new ApiError("The Report Not Found" , 404)
    return await reportRepository.updateReport(reportId , {
        complaint,
        examination,
        diagnosis,
        treatment,
        notes,
        nextVisit
    })
}


// ── Users Management ──────────────────────────────────

const getAllUsers = async () =>{
    return await userRepository.getUsers()
}

const searchUsers = async (q) =>{
    if(!q) throw new ApiError("The search word is required" , 400)
    
    const appointments = await appointmentRepository.findUserByQuery(q)

    const users = appointments.map(a => a.userData)
    return Array.from(
        new Map(users.map((user) => [user._id || user.nationalId || user.phone , user])).values()
    )
}


const toggleUserStatus = async (userId)=>{
    const user = await userRepository.getUserById(userId)
    if(!user) throw new ApiError("User Not Found" , 404)
    return await userRepository.toggleUserStatus(userId , user.isActive)
}




const 
export {
  getDashboard,
  addDoctor,
  getDoctors,
  removeDoctor,
  toggleDoctorAvailability,
  getAllAppointment,
  getUserAppointment,
  cancelAppointment,
  getAllConsultation,
  getUserConsultation,
  cancelConsultation,
  completeConsultation,
  getAllReports,
  getUserReports,
  deleteReport,
  editReport,
  getAllUsers,
  getUserReports,
  searchUsers,
  toggleUserStatus
};
