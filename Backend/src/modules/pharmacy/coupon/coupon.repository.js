import Coupon from "./coupon.model.js";
import CouponRedemption from "./coupon-redemption.model.js";

const createCoupon = (data) => Coupon.create(data);

const findByPharmacy = (pharmacyId) =>
  Coupon.find({ pharmacyId }).sort({ createdAt: -1 });

const findByCode = (pharmacyId, code) =>
  Coupon.findOne({ pharmacyId, code: code?.toUpperCase().trim() });

const findById = (id) => Coupon.findById(id);

const updateCoupon = (id, pharmacyId, data) =>
  Coupon.findOneAndUpdate({ _id: id, pharmacyId }, data, { new: true });

const deleteCoupon = (id, pharmacyId) =>
  Coupon.findOneAndDelete({ _id: id, pharmacyId });

const incrementUsed = (id) =>
  Coupon.findByIdAndUpdate(id, { $inc: { usedCount: 1 } }, { new: true });

// ── Redemptions ──────────────────────────────────────────
const countUserRedemptions = (couponId, userId) =>
  CouponRedemption.countDocuments({ couponId, userId });

const recordRedemption = (data) => CouponRedemption.create(data);

export {
  createCoupon,
  findByPharmacy,
  findByCode,
  findById,
  updateCoupon,
  deleteCoupon,
  incrementUsed,
  countUserRedemptions,
  recordRedemption,
};
