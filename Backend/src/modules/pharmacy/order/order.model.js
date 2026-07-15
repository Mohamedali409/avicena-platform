import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const genOrderNumber = customAlphabet("0123456789ABCDEFGHJKLMNPQRSTUVWXYZ", 10);

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      default: () => `AV-${genOrderNumber()}`,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: true,
      index: true,
    },
    // Optional link to the prescription the order was placed from.
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "report",
      default: null,
    },

    items: [orderItemSchema],

    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: "" },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },

    fulfillment: {
      method: {
        type: String,
        enum: ["delivery", "pickup"],
        required: true,
      },
      address: {
        line1: { type: String, default: "" },
        line2: { type: String, default: "" },
        city: { type: String, default: "" },
        phone: { type: String, default: "" },
      },
      etaMinutes: { type: Number, default: 0 },
    },

    payment: {
      method: { type: String, enum: ["cod", "online"], default: "cod" },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      provider: { type: String, default: "" },
      reference: { type: String, default: "" },
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
        "completed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },
    statusHistory: [
      {
        status: String,
        at: { type: Date, default: Date.now },
        note: String,
      },
    ],
    cancelReason: { type: String, default: "" },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
