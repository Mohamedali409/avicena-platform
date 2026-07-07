async function login(email, password, role) {
  const Model = modelMap[role];
  const user = await Model.findOne({ email });
  // باقي الـ logic...
}

import bcrypt from "bcryptjs";
import ApiError from "../../shared/utils/ApiError.js";
import validator from "validator";
import * as authRepository from "./auth.repository.js";
import { sendWelcomeEmail } from "../../infrastructure/mail/mail.service.js";
import { signToken } from "../../shared/utils/jwt.utlis.js";
import * as doctorRepository from "../doctors/doctor.repository.js";
import * as labRepository from "../labs/labs.repository.js";
import * as userRepository from "../User/user.repository.js";
import {
  signRefreshToken,
  verifyRefreshToken,
} from "../../shared/utils/jwt.utlis.js";
import {
  saveRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
} from "../../infrastructure/redis/session.service.js";

// import User from "../User/user.model.js";
// // auth.service.js
// const modelMap = {
//   patient: User,
//   admin: UserModel,
//   doctor: DoctorModel,
//   lab: LabModel,
// };

const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

const comparePassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};

const registerPatient = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new ApiError("All filed is required", 400);
  }
  if (!validator.isEmail(email)) {
    throw new ApiError("email is not valid ", 400);
  }
  if (password.length < 8) {
    throw new ApiError("password must be 8 char ", 400);
  }

  const exists = await authRepository.findUserByEmail(email);
  if (exists) throw new ApiError("this email is used before", 409);

  const hashed = await hashPassword(password);
  console.log("Password:", password);
  console.log("Hash:", hashed);
  const user = await authRepository.createUser({
    name,
    email,
    password: hashed,
  });

  sendWelcomeEmail(email, name).catch(console.error);

  const token = signToken({ id: user._id, role: "patient" });
  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
  };
};

const loginPatient = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError("Some filed is required");
  }

  const user = await authRepository.findUserByEmail(email);

  if (!user) throw new ApiError("User not found", 401);
  if (!user.isActive) throw new ApiError("This Account is Blocked", 403);

  const match = await comparePassword(password, user.password);

  if (!match) throw new ApiError("Email or Password is required", 401);

  // if (!match) throw new ApiError("Invalid credentials", 401);

  const token = signToken({ id: user._id, role: "patient" });
  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
  };
};

// ── Google OAuth
// TODO

// ── Doctor login
const loginDoctor = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError("all filed is required", 400);
  }
  const doctor = await doctorRepository.findDoctorByEmail(email);
  console.log("Doctor =>", doctor);
  console.log("isActive =>", doctor.isActive);
  console.log("DB Password =>", doctor.password);
  if (!doctor)
    throw new ApiError(
      "Sorry Email or Password if filed please try again later",
      401,
    );

  // if (!doctor.isActive) throw new ApiError("This Account is blocked", 403);

  const match = await comparePassword(password, doctor.password);
  if (!match) throw new ApiError("This Account is blocked", 403);

  const token = await signToken({ id: doctor._id, role: "doctor" });
  return {
    token,
    doctor: {
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      image: doctor.image,
    },
  };
};

const loginLab = async ({ email, password }) => {
  if (!email || !password) throw new ApiError("All filed is required", 400);

  const lab = await labRepository.findLabByEmail(email);
  if (!lab)
    throw new ApiError(
      "Sorry Email or Password if filed please try again later",
      401,
    );

  const match = await comparePassword(password, lab.password);
  if (!match)
    throw new ApiError(
      "Sorry Email or Password if filed please try again later",
      401,
    );

  const token = signToken({ id: lab._id, role: "lab" });
  return { token, lab: { _id: lab._id, name: lab.name, email: lab.email } };
};

const loginAdmin = async ({ email, password }) => {
  if (!email || !password) throw new ApiError("All filed is required", 400);

  const user = await userRepository.findAdminByEmailAndRole(email);
  if (!user)
    throw new ApiError(
      "Sorry Email or Password if filed please try again later",
      401,
    );

  const match = await comparePassword(password, user.password);
  if (!match)
    throw new ApiError(
      "Sorry Email or Password if filed please try again later",
      401,
    );

  const token = signToken({ id: user._id, role: "admin" });
  return {
    token,
    admin: { _id: user._id, name: user.name, email: user.email },
  };
};

const issueTokens = async (payload) => {
  const accessToken = signToken(payload);
  const refreshToken = signRefreshToken(payload);
  await saveRefreshToken(payload.id, refreshToken);
  return { accessToken, refreshToken };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new ApiError("Refresh Token is required ", 400);

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError("The Refresh Token Is Ended ", 401);
  }

  const stored = await getRefreshToken(decoded.id);
  if (!stored || stored !== refreshToken)
    throw new ApiError("The Refresh Token Is Ended ", 401);

  const accessToken = signToken({ id: decoded.id, role: decoded.role });
  return { accessToken };
};

const logout = async (userId) => {
  await deleteRefreshToken(userId);
};

export {
  registerPatient,
  loginPatient,
  loginDoctor,
  loginAdmin,
  loginLab,
  issueTokens,
  refreshAccessToken,
  logout,
};
