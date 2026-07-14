import * as authService from "./auth.service.js";
import * as messageResponse from "../../shared/utils/ApiResponse.js";
import catchAsync from "../../shared/utils/catchAsync.js";
import { refreshAccessToken, logout } from "./auth.service.js";

const register = catchAsync(async (req, res) => {
  console.log("BODY => ", req.body);
  const data = await authService.registerPatient(req.body);
  messageResponse.successResponse(res, "Account created success", data, 201);
});

const login = catchAsync(async (req, res) => {
  const data = await authService.loginPatient(req.body);
  messageResponse.successResponse(res, "Login success", data);
});

//Forget password
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const data = await authService.forgotPassword(email);

  messageResponse.successResponse(res, "OTP send successfully.", data);
});

//  Reset Password
const resetPassword = catchAsync(async (req, res) => {
  const data = await authService.resetPassword(req.body);

  messageResponse.successResponse(res, "password reset successfully.", data);
});

// Verify Email
const verifyEmail = catchAsync(async (req, res) => {
  const data = await authService.verifyEmail(req.body);

  messageResponse.successResponse(res, "Email verified successfully.", data);
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
  resetPassword,
  forgotPassword,
  verifyEmail,
};
