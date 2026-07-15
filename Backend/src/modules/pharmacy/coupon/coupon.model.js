import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: [true, "The code is required"],
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    value: {
      type: Number,
      required: [true, "The coupon value is required"],
      min: 0,
    },

    scope: {
      type: String,
      enum: ["all", "category", "product"],
      default: "all",
    },
    category: { type: String, default: "" }, // when scope === "category"
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    }, // when scope === "product"

    minOrder: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 0 },

    validFrom: { type: Date, default: () => new Date() },
    validTo: { type: Date, required: [true, "Coupon exp date is required"] },

    maxUses: { type: Number, default: 0 },
    maxUsesPerUser: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

couponSchema.index({ pharmacyId: 1, code: 1 }, { unique: true });

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default Coupon;
