import PharmacyApplication from "./application.model.js";

const createApplication = (data) => {
  return PharmacyApplication.create(data);
};

const findApplicationById = (id) => {
  return PharmacyApplication.findById(id);
};

const findApplicationByEmail = (email) => {
  return PharmacyApplication.findOne({ email });
};

const findApplicationByLicense = (licenseNumber) => {
  return PharmacyApplication.findOne({ licenseNumber });
};

const getAllApplications = () => {
  return PharmacyApplication.find().sort({ createdAt: -1 });
};

const updateApplication = (id, data) => {
  return PharmacyApplication.findByIdAndUpdate(id, data, {
    new: true,
  });
};

const deleteApplication = (id) => {
  return PharmacyApplication.findByIdAndDelete(id);
};

const countApplications = () => {
  return PharmacyApplication.countDocuments();
};

// Admin
const getPendingApplications = () => {
  return PharmacyApplication.find({
    status: "pending",
  }).sort({ createdAt: -1 });
};

const getApplicationByStatus = (status) => {
  return PharmacyApplication.find({ status });
};

export {
  createApplication,
  findApplicationById,
  findApplicationByEmail,
  findApplicationByLicense,
  getAllApplications,
  updateApplication,
  deleteApplication,
  countApplications,
  getPendingApplications,
  getApplicationByStatus,
};
