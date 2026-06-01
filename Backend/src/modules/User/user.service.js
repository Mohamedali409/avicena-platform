import {
  deleteCache,
  getCache,
  setCache,
} from "../../infrastructure/redis/cache.service.js";
import { uploadImage } from "../../infrastructure/storage/cloudinary.service";
import ApiError from "../../shared/utils/ApiError.js";
import * as userRepository from "./user.repository.js";
import * as doctorRepository from "../doctors/doctor.repository.js";
import * as appointmentRepository from "../appointments/appointment.repository.js";
import { addSlot, isSlotTaken } from "../../shared/utils/slots.utils.js";
import { sendAppointmentEmail } from "../../infrastructure/mail/mail.service.js";

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

export { getProfile, updateProfile, bookAppointment };
