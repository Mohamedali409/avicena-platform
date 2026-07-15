import { Router } from "express";
import * as productController from "./product.controller.js";
import { pharmacyGuard } from "../../../shared/guards/pharmacy.guard.js";
import upload from "../../../shared/middleware/multer.midleware.js";

const router = Router();

// ── Public / any authenticated party ──────────────────────
router.get("/", productController.searchProducts);
router.get("/barcode/:barcode", productController.getByBarcode);
router.get("/:id/alternatives", productController.getAlternatives);
router.get("/:id", productController.getById);

// ── Pharmacy: add/update catalog products (barcode or manual) ──
router.post(
  "/",
  pharmacyGuard,
  upload.single("image"),
  productController.createProduct,
);

router.post(
  "/:id",
  pharmacyGuard,
  upload.single("image"),
  productController.updateProduct,
);

export default router;
