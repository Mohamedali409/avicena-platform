import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    doctorName: {
      type: String,
      required: [true, "Doctor name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    // confirmPassword: {
    //   type: String,
    //   required: [true, "Confirm Password is required"],
    //   validate: {
    //     validator: function (val) {
    //       return val === this.password;
    //     },
    //     message: "Password are not match",
    //   },
    //   select: false,
    // },
    role: {
      type: String,
      enum: ["doctor"],
      default: "doctor",
    },
    image: {
      type: String,
      default: "",
    },
    phone: { type: String, default: "00000000000" },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    degree: { type: String, required: [true, "Doctor degree is required"] },
    expertise: {
      type: String,
      required: [true, "Doctor Expertise is required"],
    },
    about: { type: String, required: [true, "Doctor about is required"] },
    available: {
      type: Boolean,
      default: true,
    },
    fees: { type: Number, required: [true, "Doctor fees is required"] },
    consultation_fees: {
      type: Number,
      required: [true, "Doctor consultation fees is required"],
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
    date: { type: Number, required: [true, "doctor date is required"] },
    slots_booked: { type: Object, default: {} },
    start_booked: {
      from: {
        type: Number,
        required: [true, "Doctor start booked is required"],
        default: 9,
      },
      to: {
        type: Number,
        required: [true, "Doctor end booked is required"],
        default: 16,
      },
      booking_period: {
        type: Number,
        required: [true, "Doctor booked period is required"],
        default: 15,
      },
    },
  },
  { minimize: false, timestamps: true },
);

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default Doctor;
