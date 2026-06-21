// plans
// feature access
// expiration

import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["free", "basic", "premium"],
      required: true,
      default: "free",
    },
    price: { type: Number, required: true, default: 0 },
    features: {
      maxConsultationsPerMonth: { type: Number, default: 1 },
      videoCallEnabled: { type: Boolean, default: false },
      chatEnabled: { type: Boolean, default: true },
      prioritySupport: { type: Boolean, default: false },
    },
    startDate: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    paymentId: { type: String },
  },
  { timestamps: true },
);

subscriptionSchema.index({ userId: 1, status: 1 });

const SubscriptionModel =
  mongoose.models.subscription ||
  mongoose.model("subscription", subscriptionSchema);
export default SubscriptionModel;
