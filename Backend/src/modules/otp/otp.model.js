import mongoose from "mongoose";
import { OTP_TYPES } from "./otp.constants.js";

const otpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user name is required"],
      index: true,
    },

    code: {
      type: String,
      required: [true, "the otp code is required"],
    },
    type: {
      type: String,
      enum: Object.values(OTP_TYPES),
      required: [true, "the type of otp is required"],
    },

    expiresAt: {
      type: Date,
      required: [true, "the expiration time is required"],
      index: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema);

export default Otp;
