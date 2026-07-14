import { Router } from "express";
import * as applicationController from "./application.controller.js";
import upload from "../../../shared/middleware/multer.midleware.js";
import { adminGuard } from "../../../shared/guards/admin.guard.js";

const router = Router();

/* ---------- Public ---------- */

// Submit Pharmacy Application
router.post(
  "/",
  upload.single("documents"),
  applicationController.submitApplication,
);

/* ---------- Admin ---------- */

// Statistics
router.get("/statistics", adminGuard, applicationController.getStatistics);

// Get all applications
router.get("/", adminGuard, applicationController.getAllApplications);

// Get application details
router.get("/:id", adminGuard, applicationController.getApplicationById);

// Approve application
router.patch(
  "/:id/approve",
  adminGuard,
  applicationController.approveApplication,
);

// Reject application
router.patch(
  "/:id/reject",
  adminGuard,
  applicationController.rejectApplication,
);

// Delete application
router.delete("/:id", adminGuard, applicationController.deleteApplication);

export default router;
