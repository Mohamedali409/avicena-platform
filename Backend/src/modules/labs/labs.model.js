import mongoose from "mongoose";

// reports upload
const labSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "lab name is required"],
    },
    email: {
      type: String,
      required: [true, "Lab email is required"],
      unique: [true, "Lab email is required"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Lab password is required"],
      select: false,
    },
    image: { type: String },
    phone: { type: String },
    address: {
      line1: {
        type: String,
        required: [true, "Lab address line 1 is required"],
      },
      line2: { type: String, default: "" },
      city: { type: String, default: "" },
    },
    certifications: [{ type: String }],
    tests: [
      {
        name: { type: String, required: [true, "Lab test name is required"] },
        price: { type: Number, required: [true, "Lab test price is required"] },
        duration: { type: String },
        description: { type: String },
      },
    ],
    workingHours: {
      from: { type: String, default: "08:00" },
      to: { type: String, default: "20:00" },
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Lab = mongoose.models.Lab || mongoose.model("Lab", labSchema);

export default Lab;
