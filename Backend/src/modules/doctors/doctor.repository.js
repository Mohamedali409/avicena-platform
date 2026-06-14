import Doctor from "./doctor.model.js";

const createDoctor = (data) => {
  return Doctor.create(data);
};

const getDoctors = () => {
  return Doctor.find().select("-password");
};

const removeDoctor = (docId) => {
  return Doctor.findByIdAndDelete(docId);
};

const findDoctorByEmail = (email) => {
  return Doctor.findOne({ email }).select("+password");
};

const findDoctorById = (docId) => {
  return Doctor.findById(docId);
};

const findDoctorAndUpdate = (docId, data) => {
  return Doctor.findByIdAndUpdate(docId, data, { new: true }).select(
    "-password",
  );
};

export { findDoctorByEmail, findDoctorById, findDoctorAndUpdate };

const getDoctorCountDocuments = () => {
  return Doctor.countDocuments();
};

const findDoctorActive = () => {
  return Doctor.find({ isActive: true }).select("-password -email");
};

const clearSlots = (docId) => {
  return Doctor.findByIdAndUpdate(docId, { slots_booked: {} });
};

const countDocumentsWiteUserId = async (userId) => {
  return Doctor.countDocuments({ userId });
};

export {
  createDoctor,
  getDoctors,
  removeDoctor,
  findDoctorByEmail,
  findDoctorById,
  findDoctorAndUpdate,
  getDoctorCountDocuments,
  findDoctorActive,
  clearSlots,
  countDocumentsWiteUserId,
};
