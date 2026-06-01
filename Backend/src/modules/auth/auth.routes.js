import { Router } from "express";
import {
  register,
  login,
  labLogin,
  adminLogin,
  doctorLogin,
} from "./auth.controller.js";

const authRouter = Router();

// patient
authRouter.post("/register", register);
authRouter.post("/login", login);

// google login OAuth
// TODO...

// Admin
authRouter.post("/admin/login", adminLogin);

// Doctor
authRouter.post("/doctor/login", doctorLogin);

// lab
authRouter.post("/lab/login", labLogin);

export default authRouter;
