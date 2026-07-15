import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dosage: { type: String, default: "" },
    times: { type: [String], default: [] },
    startDate: { type: Date, default: () => new Date() },
    days: { type: Number, default: 1, min: 1 },
  },
  { _id: true },
);

const scheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "report",
      default: null,
    },
    medications: [medicationSchema],
    channels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
    },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

const MedicationSchedule =
  mongoose.models.MedicationSchedule ||
  mongoose.model("MedicationSchedule", scheduleSchema);

export default MedicationSchedule;
