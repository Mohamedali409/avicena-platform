import bcrypt from "bcrypt";
import validator from "validator";
import {
  deleteCache,
  getCache,
  setCache,
} from "../../../infrastructure/redis/cache.service.js";
import { uploadImage } from "../../../infrastructure/storage/cloudinary.service.js";
import ApiError from "../../../shared/utils/ApiError.js";
import { queuePharmacyWelcomeEmail } from "../../../infrastructure/queue/email.queue.js";
import * as pharmacyRepository from "./pharmacy.repository.js";

const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

const parseMaybeJson = (value, fallback) => {
  if (value == null) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const getAllPharmacies = () => pharmacyRepository.getAllPharmacies();

const getPharmacyById = async (id) => {
  const pharmacy = await pharmacyRepository.findPharmacyById(id);
  if (!pharmacy) throw new ApiError("The Pharmacy not found.", 404);
  return pharmacy;
};

const getProfile = async (pharmacyId) => {
  const pharmacy = await pharmacyRepository.findPharmacyById(pharmacyId);
  if (!pharmacy) throw new ApiError("The Pharmacy Profile is required.", 404);
  return pharmacy;
};

const updatePharmacyProfile = async (pharmacyId, body, imageFile) => {
  const {
    pharmacyName,
    phone,
    licenseNumber,
    address,
    workingHours,
    delivery,
    pickup,
    location,
  } = body;
  const update = {};
  if (name != null) update.name = name;
  if (phone != null) update.phone = phone;
  if (licenseNumber != null) update.licenseNumber = licenseNumber;
  if (address != null) update.address = parseMaybeJson(address, undefined);
  if (workingHours != null)
    update.workingHours = parseMaybeJson(workingHours, undefined);
  if (delivery != null) update.delivery = parseMaybeJson(delivery, undefined);
  if (pickup != null) update.pickup = parseMaybeJson(pickup, undefined);
  if (location != null) update.location = parseMaybeJson(location, undefined);

  if (imageFile)
    update.image = await uploadImage(imageFile.path, "avicena/pharmacies");

  const updated = await pharmacyRepository.updatePharmacy(pharmacyId, update);
  await deleteCache("pharmacies:list");
  return update;
};

export { getAllPharmacies, getPharmacyById, updatePharmacyProfile, getProfile };
