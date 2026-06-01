import Appointment from "./appointment.model.js";

const createAppointment = (data) => {
  return Appointment.create(data);
};

export { createAppointment };
