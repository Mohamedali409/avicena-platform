// booking
// cancel
// reschedule
// status tracking

import mongoose, { mongo } from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user id is required"],
    },
    docId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "doctor id is required"],
    },
    slotDate: {
      type: String,
      required: [true, "slot date is required"],
    },
    slotTime: {
      type: String,
      required: [true, "Time slot is required"],
    },
    userData: {
      type: Object,
      required: [true, "User data is required"],
    },
    docData: {
      type: Object,
      required: [true, "Doctor data is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    // "examination" (كشف) or "consultation" (استشارة) — drives which fee is charged.
    type: {
      type: String,
      enum: ["examination", "consultation"],
      default: "examination",
    },
    // date: { type: Number, required: true },
    cancelled: {
      type: Boolean,
      required: false,
      default: false,
    },
    payment: {
      type: Boolean,
      required: false,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent double-booking the same doctor slot at the DB level. Partial so that
// a cancelled booking frees the slot (the index only covers active bookings).
// A concurrent second create for the same slot fails with a duplicate-key
// error (E11000), which the booking service maps to a clean 409.
appointmentSchema.index(
  { docId: 1, slotDate: 1, slotTime: 1 },
  { unique: true, partialFilterExpression: { cancelled: false } },
);

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);

export default Appointment;
