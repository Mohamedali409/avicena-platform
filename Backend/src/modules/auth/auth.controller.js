import * as authService from "./auth.service.js";
import * as messageResponse from "../../shared/utils/ApiResponse.js";
import catchAsync from "../../shared/utils/catchAsync.js";
import { refreshAccessToken, logout } from "./auth.service.js";
import { clearAuthCookies, setAuthCookies } from "./auth.cookies.js";

const register = catchAsync(async (req, res) => {
  console.log("BODY => ", req.body);
  const data = await authService.registerPatient(req.body);
  messageResponse.successResponse(res, "Account created success", data, 201);
});

// Unified login — detects role from the email (patient/admin/doctor/lab).
const login = catchAsync(async (req, res) => {
  const data = await authService.loginUnified(req.body);

  setAuthCookies(res, data.accessToken, data.refreshToken);

  delete data.accessToken;
  delete data.refreshToken;

  messageResponse.successResponse(res, "Login success", data);
});

//Forget password
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const data = await authService.forgotPassword(email);

  messageResponse.successResponse(res, "OTP sent successfully.", data);
});

//  Reset Password
const resetPassword = catchAsync(async (req, res) => {
  const data = await authService.resetPassword(req.body);

  messageResponse.successResponse(res, "Password reset successfully.", data);
});

// Verify Email
const verifyEmail = catchAsync(async (req, res) => {
  const data = await authService.verifyEmail(req.body);
  setAuthCookies(res, data.accessToken, data.refreshToken);

  delete data.accessToken;
  delete data.refreshToken;

  messageResponse.successResponse(res, "Email verified successfully.", data);
});

// resend verification otp
const resendVerificationOtp = catchAsync(async (req, res) => {
  const { email } = req.body;

  const data = await authService.resendVerificationOtp(email);

  messageResponse.successResponse(
    res,
    "Verification OTP sent successfully.",
    data,
  );
});

// resend reset password otp
const resendResetPasswordOtp = catchAsync(async (req, res) => {
  const { email } = req.body;

  const data = await authService.resendResetPasswordOtp(email);

  messageResponse.successResponse(
    res,
    "Reset password OTP sent successfully.",
    data,
  );
});

// change password
const changePassword = catchAsync(async (req, res) => {
  const data = await authService.changePassword(req.userId, req.body);

  messageResponse.successResponse(res, "Password changed successfully", data);
});

// admin login

const adminLogin = catchAsync(async (req, res) => {
  const data = await authService.loginAdmin(req.body);
  messageResponse.successResponse(res, "Admin Login Successfully", data);
});

/*******************************************************************/
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
  const refreshToken = req.cookies.refreshToken;

  const { accessToken } = await authService.refreshAccessToken(refreshToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  messageResponse.successResponse(res, "Token refreshed");
});

const logoutUser = catchAsync(async (req, res) => {
  await logout(req.userId);

  clearAuthCookies(res);

  messageResponse.successResponse(res, "Logout successfully");
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
  resendVerificationOtp,
  resendResetPasswordOtp,
  changePassword,
};
