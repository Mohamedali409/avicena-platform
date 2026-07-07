import { Router } from "express";
import {
  register,
  login,
  labLogin,
  adminLogin,
  doctorLogin,
  refresh,
  logoutUser,
} from "./auth.controller.js";
import { authGuard } from "../../shared/guards/auth.guard.js";
import { authlimiter } from "../../shared/middleware/rate-limit.middleware.js";

const authRouter = Router();

// patient
authRouter.post("/register", authlimiter, register);
authRouter.post("/login", authlimiter, login);

// google login OAuth
// TODO...

// Refresh & Logout
authRouter.post("/refresh", refresh);
authRouter.post("/logout", authGuard, logoutUser);

// Admin
authRouter.post("/admin/login", authlimiter, adminLogin);

// Doctor
authRouter.post("/doctor/login", authlimiter, doctorLogin);

// lab
authRouter.post("/lab/login", authlimiter, labLogin);

export default authRouter;
