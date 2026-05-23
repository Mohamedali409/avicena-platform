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

const comparePassword = (plain, hashed) => {
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

  const user = await authRepository.findUserByEmail(email).select("+password");
  if (!user) throw new ApiError("Email or Password is required", 401);
  if (!user.isActive) throw new ApiError("This Account is Blocked", 403);

  const match = await comparePassword(password, user.password);
  if (!match) throw new ApiError("Email or Password is required", 401);

  const token = signToken({ id: user._id, role: "patient" });
  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.name,
      image: user.image,
    },
  };
};
export { registerPatient, loginPatient };
