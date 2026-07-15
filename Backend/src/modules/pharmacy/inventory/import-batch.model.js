import mongoose from "mongoose";

const importBatchSchema = new mongoose.Schema(
  {
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: true,
      index: true,
    },
    filename: { type: String, default: "" },
    mode: { type: String, enum: ["upsert", "replace"], default: "upsert" },
    status: {
      type: String,
      enum: ["preview", "applied", "failed"],
      default: "preview",
    },
    stats: {
      total: { type: Number, default: 0 },
      created: { type: Number, default: 0 },
      updated: { type: Number, default: 0 },
      deactivated: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
    },
    errors: [{ row: Number, reason: String }],
  },
  { timestamps: true },
);

const ImportBatch =
  mongoose.models.ImportBatch ||
  mongoose.model("ImportBatch", importBatchSchema);

export default ImportBatch;
