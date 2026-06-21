import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: [true, "Appointment id is required"],
  },
  appointmentData: {
    type: Object,
    required: [true, "Appointment data is required"],
  },

  docId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: [true, "Doctor id is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User id is required"],
  },
  userData: {
    type: Object,
    required: [true, "User data is required"],
  },
  docData: {
    type: Object,
    required: [true, "Doctor data is required"],
  },
  consultDay: {
    type: String,
    required: [true, "Consultation Day is required"],
  },
  consulTime: {
    type: String,
    required: [true, "Consultation Time is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    required: false,
  },
});

const Consultation =
  mongoose.models.Consultation ||
  mongoose.model("Consultation", consultationSchema);

export default Consultation;
