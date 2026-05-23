import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true },
    recipientType: {
      type: String,
      enum: ["user", "doctor", "admin", "lab"],
      required: true,
    },
    type: {
      type: String,
      enum: [
        "appointment",
        "consultation",
        "report",
        "system",
        "payment",
        "chat",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Object, default: {} }, // extra payload (appointmentId, etc.)
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

notificationSchema.index({ recipientId: 1, isRead: 1 });

const NotificationModel =
  mongoose.models.notification ||
  mongoose.model("notification", notificationSchema);
export default NotificationModel;
