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
    // date: { type: Number, required: true },
    cancelled: {
      type: Boolean,
      required: false,
    },
    payment: {
      type: Boolean,
      required: false,
    },
    isCompleted: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);

export default Appointment;
