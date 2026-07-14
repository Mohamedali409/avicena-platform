import { Router } from "express";
import {
  register,
  login,
  labLogin,
  adminLogin,
  doctorLogin,
  refresh,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationOtp,
  resendResetPasswordOtp,
  changePassword,
} from "./auth.controller.js";
import { authGuard } from "../../shared/guards/auth.guard.js";
import {
  authlimiter,
  otpLimiter,
} from "../../shared/middleware/rate-limit.middleware.js";

const authRouter = Router();

// patient
authRouter.post("/register", authlimiter, register);
authRouter.post("/login", authlimiter, login);

// google login OAuth
// TODO...

// Refresh & Logout
authRouter.post("/refresh", authlimiter, refresh);
authRouter.post("/logout", authGuard, logoutUser);
authRouter.post("/forgot-password", otpLimiter, forgotPassword);
authRouter.post("/reset-password", authlimiter, resetPassword);
authRouter.post("/verify-email", authlimiter, verifyEmail);
authRouter.post("/resend-verification", otpLimiter, resendVerificationOtp);
authRouter.post("/resend-reset-password", otpLimiter, resendResetPasswordOtp);
authRouter.post("/change-password", authlimiter, changePassword);

// Admin
authRouter.post("/admin/login", authlimiter, adminLogin);

// Doctor
authRouter.post("/doctor/login", authlimiter, doctorLogin);

// lab
authRouter.post("/lab/login", authlimiter, labLogin);

export default authRouter;
