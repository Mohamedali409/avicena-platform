import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    price: { type: Number, required: [true, "The price is required"], min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: true },
    lastBatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ImportBatch",
      default: null,
    },
  },
  { timestamps: true },
);

inventorySchema.index({ pharmacyId: 1, productId: 1 }, { unique: true });

const Inventory =
  mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);

export default Inventory;
