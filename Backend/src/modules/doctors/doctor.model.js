import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = new mongoose.Schema(
  {
    doctorName: {
      type: String,
      required: [true, "Doctor name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
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
      enum: ["doctor", "lab"],
      default: "doctor",
    },
    image: { type: String, required: [true, "image is required"] },
    phone: { type: String, default: "00000000000" },
    Specialization: {
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
      default: [true, "doctor available is required "],
    },
    fees: { type: Number, required: [true, "Doctor fees is required"] },
    consultation_fees: {
      type: Number,
      required: [true, "Doctor consultation fees is required"],
    },
    address: { type: Object, required: [true, "Doctor address is required "] },
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

// doctorSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;
//   this.password = await bcrypt.hash(this.password, 10);
//   this.confirmPassword = undefined;
// });

// doctorSchema.methods.comparePassword = async function (passwordDoctorEnter) {
//   return await bcrypt.compare(this.password, passwordDoctorEnter);
// };

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default Doctor;
