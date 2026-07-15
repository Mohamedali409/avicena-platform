import mongoose from "mongoose";

const redemptionSchema = new mongoose.Schema(
  {
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    discountApplied: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const CouponRedemption =
  mongoose.models.CouponRedemption ||
  mongoose.model("CouponRedemption", redemptionSchema);

export default CouponRedemption;
