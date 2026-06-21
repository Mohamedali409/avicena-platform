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
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const ChatModel = mongoose.models.chat || mongoose.model("chat", messageSchema);
export default ChatModel;
