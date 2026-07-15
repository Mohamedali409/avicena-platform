import { successResponse } from "../../../shared/utils/ApiResponse.js";
import catchAsync from "../../../shared/utils/catchAsync.js";
import * as couponService from "./coupon.service.js";

const createCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.createCoupon(req.pharmacyId, req.body);
  successResponse(res, "تم إنشاء الكوبون", { coupon }, 201);
});

const listCoupons = catchAsync(async (req, res) => {
  const coupons = await couponService.listCoupons(req.pharmacyId);
  successResponse(res, "قائمة الكوبونات", { coupons });
});

const updateCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.updateCoupon(
    req.params.id,
    req.pharmacyId,
    req.body,
  );
  successResponse(res, "تم تحديث الكوبون", { coupon });
});

const deleteCoupon = catchAsync(async (req, res) => {
  await couponService.deleteCoupon(req.params.id, req.pharmacyId);
  successResponse(res, "تم حذف الكوبون");
});

export { createCoupon, listCoupons, updateCoupon, deleteCoupon };
