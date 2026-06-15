import {
  deleteCache,
  getCache,
  setCache,
} from "../../infrastructure/redis/cache.service.js";
import { uploadImage } from "../../infrastructure/storage/cloudinary.service.js";
import ApiError from "../../shared/utils/ApiError.js";
import * as labRepository from "./labs.repository.js";

const getAllLabs = async () => {
  const cached = await getCache("labs:list");
  if (cached) return cached;
  const labs = await labRepository.findLabs();
  await setCache("labs:list", labs, 60);
  return labs;
};

const getLabById = async (labId) => {
  const lab = await labRepository.findLabById(labId);
  if (!lab) throw new ApiError("the lab not found", 404);
  return lab;
};

const getLabProfile = async (labId) => {
  const cached = await getCache(`lab:${labId}:profile`);
  if (cached) return cached;
  const lab = await labRepository.findLabById(labId);
  if (!lab) throw new ApiError("the lab profile not found", 404);
  await setCache(`lab:${labId}:profile`, lab, 120);
  return lab;
};

const updateLabeProfile = async (labId, body, imageFile) => {
  const { name, phone, address, workingHours } = body;
  const update = {
    name,
    phone,
    address: typeof address === "string" ? JSON.parse(address) : address,
    workingHours:
      typeof workingHours === "string"
        ? JSON.parse(workingHours)
        : workingHours,
  };
  if (imageFile)
    update.image = await uploadImage(imageFile.path, "avicena/labs");
  await labRepository.updateLab(labId, update);
  await deleteCache(`lab:${labId}:profile`);
};

// Admin : Add lab

const addLab = async (body, imageFile) => {
  const {
    name,
    email,
    password,
    phone,
    address,
    certification,
    tests,
    workingHours,
  } = body;

  if (!name || !email || !password || !phone || !address)
    throw new ApiError("the filed is required", 400);

  if (!validator.isEmail(email))
    throw new ApiError("The email is not valid", 400);

  const exists = await labRepository.findLabByEmail(email);
  if (exists) throw new ApiError("The email is used before", 409);

  const slat = await bcrypt.getSalt(10);
  const hashed = await bcrypt.hash(password, slat);
  const imageUrl = imageFile
    ? await uploadImage(imageFile.path, "avicena/labs")
    : undefined;

  await labRepository.createLabeAccount({
    name,
    email,
    password: hashed,
    phone,
    image: imageUrl,
    address: typeof address === "string" ? JSON.parse(address) : address,
    certification:
      typeof certification === "string"
        ? JSON.parse(certification)
        : certification || [],
    tests: typeof tests === "string" ? JSON.parse(tests) : tests || [],
    workingHours:
      typeof workingHours === "string"
        ? JSON.parse(workingHours)
        : workingHours || [],
  });

  await deleteCache("labs:list");
};
export { getAllLabs, getLabById, getLabProfile, updateLabeProfile, addLab };
