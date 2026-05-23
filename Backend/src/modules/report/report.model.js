import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor id is required"],
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Appointment id is required"],
    },
    doctorData: {
      type: Object,
      required: [true, "Doctor data is required"],
    },
    userData: {
      type: Object,
      required: [true, "User data is required"],
    },
    complaint: {
      type: String,
      required: [true, "Complaint is required"],
    },
    examination: {
      type: String,
      required: [true, "Examination is required"],
    },
    diagnosis: {
      type: String,
      required: [true, "Diagnosis is required"],
    },
    treatment: [
      {
        name: { type: String, required: [true, "Treatment is required"] },
        dosage: { type: String },
        duration: { type: String },
      },
    ],
    notes: { type: String },
    nextVisit: { type: Date },
  },
  { timestamps: true },
);

const Report = mongoose.models.Report || mongoose.model("report", reportSchema);

export default Report;
