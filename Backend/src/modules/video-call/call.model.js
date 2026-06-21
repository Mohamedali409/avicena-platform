// WebRTC signaling
// call sessions

import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, index: true },
    callerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    callerType: { type: String, enum: ["user", "doctor"], required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverType: { type: String, enum: ["user", "doctor"], required: true },
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
    },
    type: { type: String, enum: ["video", "audio"], default: "video" },
    status: {
      type: String,
      enum: ["ringing", "ongoing", "ended", "missed", "rejected"],
      default: "ringing",
    },
    startedAt: { type: Date },
    endedAt: { type: Date },
    durationInSeconds: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

const call = mongoose.models.call || mongoose.model("Call", callSchema);

export default call;
