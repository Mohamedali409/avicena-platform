import { Router } from "express";
import * as pharmacyController from "./pharmacy.controller.js";
import { pharmacyGuard } from "../../../shared/guards/pharmacy.guard.js";
import upload from "../../../shared/middleware/multer.midleware.js";

const router = Router();

router.get("/", pharmacyController.getAllPharmacies);

router.get("/me/profile", pharmacyGuard, pharmacyController.getProfile);
router.put(
  "/me/profile",
  pharmacyGuard,
  upload.single("image"),
  pharmacyController.updateProfile,
);

router.get("/:id", pharmacyController.getPharmacyById);

export default router;
