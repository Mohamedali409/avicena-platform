import Doctor from "./doctor.model.js";

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
