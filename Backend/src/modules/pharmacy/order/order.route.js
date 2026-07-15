import { Router } from "express";
import * as orderController from "./order.controller.js";
import { authGuard } from "../../../shared/guards/auth.guard.js";
import { pharmacyGuard } from "../../../shared/guards/pharmacy.guard.js";

const router = Router();

// ── Patient ───────────────────────────────────────────────
router.post("/", authGuard, orderController.createOrder);
router.get("/my", authGuard, orderController.getMyOrders);
router.get("/my/:id", authGuard, orderController.getMyOrder);
router.patch("/my/:id/cancel", authGuard, orderController.cancelOrder);
// Payment confirmation (demo/manual). In production this is the gateway webhook.
router.post("/payment/confirm", orderController.confirmPayment);

// ── Pharmacy ──────────────────────────────────────────────
router.get("/pharmacy", pharmacyGuard, orderController.getPharmacyOrders);
router.get("/pharmacy/:id", pharmacyGuard, orderController.getPharmacyOrder);
router.patch(
  "/pharmacy/:id/status",
  pharmacyGuard,
  orderController.updateStatus,
);

export default router;
