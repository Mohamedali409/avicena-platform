import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    plan:      { type: String, enum: ["basic", "premium"], required: true },
    price:     { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    status:    { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
    stripePaymentId: { type: String },
  },
  { timestamps: true }
);

const SubscriptionModel =
  mongoose.models.subscription || mongoose.model("subscription", subscriptionSchema);
export default SubscriptionModel;
