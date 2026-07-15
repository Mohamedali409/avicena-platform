import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import { pharmacyGuard } from "../../../shared/guards/pharmacy.guard.js";

const router = Router();

router.use(pharmacyGuard);

router.post("/", couponController.createCoupon);
router.get("/", couponController.listCoupons);
router.put("/:id", couponController.updateCoupon);
router.delete("/:id", couponController.deleteCoupon);

export default router;
