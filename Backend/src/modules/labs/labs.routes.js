import { Router } from "express";
import * as labController from "./labs.controller.js";
import { labGuard } from "../../shared/guards/lab.guard.js";
import upload from "../../shared/middleware/multer.midleware.js";
import { adminGuard } from "../../shared/guards/admin.guard.js";
const router = Router();

// Public
router.get("/", labController.getAllLabs);
router.get("/:id", labController.getLabById);

// Lab protected
router.get("/me/profile", labGuard, labController.getLabProfile);
router.put(
  "/me/profile",
  labGuard,
  upload.single("image"),
  labController.updateLabeProfile,
);

// Admin only

router.post("/", adminGuard, upload.single("image"), labController.addLab);

export default router;
