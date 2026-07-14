import mongoose from "mongoose";
import { APPLICATION_STATUS } from "./application.constants.js";

const applicationSchema = new mongoose.Schema(
  {
    pharmacyName: {
      type: String,
      required: [true, "Pharmacy name is required"],
      trim: true,
    },

    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    address: {
      line1: {
        type: String,
        required: [true, "Address line1 is required"],
      },
      line2: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
    },

    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    documents: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.PENDING,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    rejectReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const PharmacyApplication =
  mongoose.models.PharmacyApplication ||
  mongoose.model("PharmacyApplication", applicationSchema);

export default PharmacyApplication;
