import Pharmacy from "./pharmacy.model.js";

const createPharmacy = (data) => {
  return Pharmacy.create(data);
};

const findPharmacyByEmail = (email) => {
  return Pharmacy.findOne({ email: email?.toLowerCase() }).select("+password");
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
// Find pharmacies near a [lng, lat] point, within maxDistance meters.
const findNearby = (lng, lat, maxDistanceMeters = 10000) =>
  Pharmacy.find({
    isActive: true,
    isVerified: true,
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [lng, lat] },
        $maxDistance: maxDistanceMeters,
      },
    },
  }).select("-password");

export {
  createPharmacy,
  findPharmacyByEmail,
  findPharmacyById,
  updatePharmacy,
  getAllPharmacies,
};
