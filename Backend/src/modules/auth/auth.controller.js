import * as authService from "./auth.service.js";
import * as messageResponse from "../../shared/utils/ApiResponse.js";
import catchAsync from "../../shared/utils/catchAsync.js";
import { refreshAccessToken, logout } from "./auth.service.js";

const register = catchAsync(async (req, res) => {
  console.log("BODY => ", req.body);
  const data = await authService.registerPatient(req.body);
  messageResponse.successResponse(res, "Account created success", data, 201);
});

// Unified login — detects role from the email (patient/admin/doctor/lab).
const login = catchAsync(async (req, res) => {
  const data = await authService.loginUnified(req.body);
  messageResponse.successResponse(res, "Login success", data);
});

// admin login

const adminLogin = catchAsync(async (req, res) => {
  const data = await authService.loginAdmin(req.body);
  messageResponse.successResponse(res, "Admin Login Successfully", data);
});

// doctor login

const doctorLogin = catchAsync(async (req, res) => {
  const data = await authService.loginDoctor(req.body);
  messageResponse.successResponse(res, "Doctor Login Successfully", data);
});

// lab login

const labLogin = catchAsync(async (req, res) => {
  const data = await authService.loginLab(req.body);
  messageResponse.successResponse(res, "Lab Login Successfully", data);
});

const refresh = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const data = await refreshAccessToken(refreshToken);
  messageResponse.successResponse(res, "token is refreshed", data);
});

const logoutUser = catchAsync(async (req, res) => {
  await logout(req.userId);
  messageResponse.successResponse(res, "logout successfully");
});

export {
  register,
  login,
  adminLogin,
  doctorLogin,
  labLogin,
  refresh,
  logoutUser,
};
