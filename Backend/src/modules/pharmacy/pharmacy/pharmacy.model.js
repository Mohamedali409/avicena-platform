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
    // GeoJSON point for "nearest pharmacy" queries. [longitude, latitude]
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    workingHours: {
      from: { type: String, default: "09:00" },
      to: { type: String, default: "23:00" },
    },
    // Delivery configuration used by the order module.
    delivery: {
      available: { type: Boolean, default: true },
      fee: { type: Number, default: 0 },
      radiusKm: { type: Number, default: 10 },
      minOrder: { type: Number, default: 0 },
      etaMinutes: { type: Number, default: 45 },
    },
    pickup: {
      available: { type: Boolean, default: true },
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
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
pharmacySchema.index({ location: "2dsphere" });

const Pharmacy =
  mongoose.models.Pharmacy || mongoose.model("Pharmacy", pharmacySchema);

export default Pharmacy;
