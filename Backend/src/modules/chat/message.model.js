  // real-time chat
// rooms
// messages
// online users

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, index: true }, // `${userId}_${docId}`
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderType: { type: String, enum: ["user", "doctor"], required: true },
    // "text" (default) or "audio" (voice note)
    type: { type: String, enum: ["text", "audio"], default: "text" },
    message: { type: String, default: "" }, // text body (empty for audio)
    audioUrl: { type: String }, // relative path served from /uploads
    duration: { type: Number }, // voice-note length in seconds
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const ChatModel = mongoose.models.chat || mongoose.model("chat", messageSchema);
export default ChatModel;
