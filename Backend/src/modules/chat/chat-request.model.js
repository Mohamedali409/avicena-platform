import mongoose from "mongoose";
import { maxLength } from "zod";

const chatRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    docId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    roomId: { type: String, required: true },
    initialMessage: { type: String, required: true, maxLength: 500 },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    rejectReason: { type: String, default: "" },
  },
  { timestamps: true },
);

chatRequestSchema.index({ roomId: 1, createdAt: -1 });
chatRequestSchema.index({ docId: 1, status: 1 });
chatRequestSchema.index({ userId: 1 });

const ChatRequest =
  mongoose.models.ChatRequest ||
  mongoose.model("ChatRequest", chatRequestSchema);

export default ChatRequest;
