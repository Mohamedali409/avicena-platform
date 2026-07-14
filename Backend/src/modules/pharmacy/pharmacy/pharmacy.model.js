import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema(
  {
    pharmacyName: {
      type: String,
      required: [true, "Pharmacy name is required"],
    },

    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
    },

    email: {
      type: String,
      required: [true, "Pharmacy email is required"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Pharmacy password is required"],
      select: false,
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
    },

    image: {
      type: String,
    },

    address: {
      line1: {
        type: String,
        required: true,
      },

      line2: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        required: true,
      },
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // مستقبلًا للنقاط والبونات
    points: {
      type: Number,
      default: 0,
    },

    coupons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Pharmacy =
  mongoose.models.Pharmacy || mongoose.model("Pharmacy", pharmacySchema);

export default Pharmacy;
