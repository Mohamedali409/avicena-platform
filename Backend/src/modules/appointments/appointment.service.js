import ApiError from "../../shared/utils/ApiError.js";
import * as appointmentRepository from "./appointment.repository.js";

const getAppointmentById = async (appointmentId) => {
  const appointment = await appointmentRepository.findById(appointmentId);

  if (!appointment) throw new ApiError("The appointment is not found", 404);

  return appointment;
};

export { getAppointmentById };
