import { Router } from "express";
import { authGuard } from "../../../shared/guards/auth.guard.js";
import upload from "../../../shared/middleware/multer.midleware.js";

import * as patientController from "./patient.controller.js";

const patientRouter = Router();

patientRouter.use(authGuard);

patientRouter.get("/profile", patientController.getProfile);
patientRouter.put(
  "/profile",
  upload.single("image"),
  patientController.updateProfile,
);

export default patientRouter;
