import { Router } from "express";
import * as inventoryController from "./inventory.controller.js";
import { pharmacyGuard } from "../../../shared/guards/pharmacy.guard.js";
import { authGuard } from "../../../shared/guards/auth.guard.js";
import excelUpload from "../../../shared/middleware/excel.multer.js";

const router = Router();

// ── Patient: prescription search (who has the medicine / alternatives) ──
router.get("/search", authGuard, inventoryController.searchByMedicine);
router.get("/report/:reportId", authGuard, inventoryController.searchByReport);

// ── Pharmacy: inventory management ────────────────────────
router.get("/me", pharmacyGuard, inventoryController.listInventory);
router.post("/me/items", pharmacyGuard, inventoryController.addOrUpdateItem);
router.delete(
  "/me/items/:productId",
  pharmacyGuard,
  inventoryController.removeItem,
);

// ── Pharmacy: Excel import ────────────────────────────────
router.post(
  "/me/import/preview",
  pharmacyGuard,
  excelUpload.single("file"),
  inventoryController.previewImport,
);
router.post(
  "/me/import/apply",
  pharmacyGuard,
  excelUpload.single("file"),
  inventoryController.applyImport,
);
router.get(
  "/me/import/batches",
  pharmacyGuard,
  inventoryController.listImportBatches,
);

export default router;
