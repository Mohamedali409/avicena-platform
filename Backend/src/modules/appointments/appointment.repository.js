import Appointment from "./appointment.model.js";

const findById = (appointmentId) => {
  return Appointment.findById(appointmentId);
};

const createAppointment = (data) => {
  return Appointment.create(data);
};

const findAllAppointmentByUserId = (userId) => {
  return Appointment.find({ userId }).sort({ date: -1 });
};

const findAppointmentById = (appointmentId) => {
  return Appointment.findById(appointmentId);
};

const findAppointmentByIdAndUpdate = (appointmentId, data) => {
  return Appointment.findByIdAndUpdate(appointmentId, data, { new: true });
};

const getAppointment = (docId, slotDate, slotTime) => {
  return Appointment.findOne({ docId, slotDate, slotTime });
};

const getAppointmentCountDocumentsByUserId = (userId) => {
  return Appointment.countDocuments({ userId });
};

const getAppointmentCountDocuments = () => {
  return Appointment.countDocuments();
};

const getLastAppointment = () => {
  return Appointment.find().sort({ date: -1 }).limit(5);
};

const getAppointments = () => {
  return Appointment.find().sort({ date: -1 });
};

const cancelAppointment = (appointmentId) => {
  return Appointment.findByIdAndUpdate(
    appointmentId,
    { cancelled: true },
    { new: true },
  );
};

const getAppointmentsByUser = (userId) => {
  return Appointment.find({ userId }).sort({ date: -1 });
};

const findUserByQuery = (docId, q) => {
  return Appointment.find({
    docId,
    $or: [
      { "userData.name": { $regex: q, $options: "i" } },
      { "userData.nationalId": { $regex: q, $options: "i" } },
      { "userData.phone": { $regex: q.replace(/\s/g, ""), $options: "i" } },
    ],
  }).limit(5);
};

const completeAppointment = (appointmentId) => {
  return Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true });
};

const findAppointmentByDoctorId = (docId) => {
  return Appointment.find({ docId }).sort({ date: -1 });
};
export {
  findById,
  createAppointment,
  findAllAppointmentByUserId,
  findAppointmentById,
  getAppointment,
  getAppointmentCountDocumentsByUserId,
  getAppointmentCountDocuments,
  getLastAppointment,
  getAppointments,
  cancelAppointment,
  getAppointmentsByUser,
  findUserByQuery,
  completeAppointment,
  findAppointmentByDoctorId,
};
