import Pharmacy from "./pharmacy.model.js";

const createPharmacy = (data) => {
  return Pharmacy.create(data);
};

const findPharmacyByEmail = (email) => {
  return Pharmacy.findOne({ email }).select("+password");
};

const findPharmacyById = (id) => {
  return Pharmacy.findById(id).select("-password");
};

const updatePharmacy = (id, data) => {
  return Pharmacy.findByIdAndUpdate(id, data, {
    new: true,
  });
};

const getAllPharmacies = () => {
  return Pharmacy.find({
    isActive: true,
  }).select("-password");
};

export {
  createPharmacy,
  findPharmacyByEmail,
  findPharmacyById,
  updatePharmacy,
  getAllPharmacies,
};
