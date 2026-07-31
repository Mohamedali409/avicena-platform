import { videoCallsTotal } from "../../infrastructure/monitoring/metrics.service.js";
import * as videoService from "./video.service.js";
import * as notificationService from "../notifications/notification.service.js";
import * as requestService from "../chat/chat.request.service.js";
import { emitNotification } from "../../infrastructure/socket/socket.server.js";

const registerVideoHandlers = (io, socket) => {
  // ── Initiate call ──────────────────────────────────────────────────────────
  socket.on(
    "call:initiate",
    async ({ receiverId, receiverType, consultationId, type }) => {
      try {
        const callerType = socket.role === "doctor" ? "doctor" : "user";

        // A patient can only call a doctor who approved the conversation (same
        // gate as chat). Doctors may initiate freely.
        if (callerType !== "doctor") {
          await requestService.assertChatAllowed(socket.userId, receiverId);
        }

        const call = await videoService.initiateCall({
          callerId: socket.userId,
          callerType,
          receiverId,
          receiverType,
          consultationId,
          type,
        });

        // caller joins the call room
        socket.join(call.roomId);

        // notify receiver
        io.to(`user:${receiverId}`).emit("call:incoming", {
          callerId: call._id, // call document ID (used to accept/reject)
          roomId: call.roomId, // actual socket room (used to join)
          from: socket.userId,
          callerType,
          type: call.type,
        });

        // push notification
        const notification = await notificationService.createNotification({
          recipientId: receiverId,
          recipientType: receiverType,
          type: "consultation",
          title: "Incoming call",
          message: "You have an incoming video call",
          data: { callerId: call._id, roomId: call.roomId },
        });
        emitNotification(receiverId, notification);

        // confirm to caller
        socket.emit("call:initiated", {
          callId: call._id,
          roomId: call.roomId,
        });
      } catch (err) {
        socket.emit("call:error", { message: err.message });
      }
    },
  );

  // ── Accept call ────────────────────────────────────────────────────────────
  const handleAccept = async ({ callId, roomId }) => {
    try {
      const call = await videoService.acceptCall(callId);
      socket.join(roomId);
      io.to(roomId).emit("call:accepted", {
        callId: call._id,
        roomId: call.roomId,
        from: socket.userId,
      });
    } catch (err) {
      socket.emit("call:error", { message: err.message });
    }
  };
  socket.on("call:accept", handleAccept);
  socket.on("call-accept", handleAccept); // legacy alias

  // ── Reject call ────────────────────────────────────────────────────────────
  socket.on("call:reject", async ({ callId, targetId }) => {
    try {
      await videoService.rejectCall(callId);
      io.to(`user:${targetId}`).emit("call:rejected", {
        callId,
        from: socket.userId,
      });
    } catch (err) {
      socket.emit("call:error", { message: err.message });
    }
  });

  // ── End call ───────────────────────────────────────────────────────────────
  socket.on("call:end", async ({ callId, roomId, targetId }) => {
    try {
      const call = await videoService.endCall(callId);
      const payload = {
        callId,
        from: socket.userId,
        duration: call.durationInSeconds,
      };
      if (roomId) {
        io.to(roomId).emit("call:ended", payload);
      } else if (targetId) {
        io.to(`user:${targetId}`).emit("call:ended", payload);
      }
    } catch (err) {
      socket.emit("call:error", { message: err.message });
    }
  });

  // ── WebRTC signaling ───────────────────────────────────────────────────────
  socket.on("call:offer", ({ targetId, offer, roomId }) => {
    videoCallsTotal.inc();
    io.to(`user:${targetId}`).emit("call:offer", {
      from: socket.userId,
      offer,
      roomId,
    });
  });

  socket.on("call:answer", ({ targetId, answer, roomId }) => {
    io.to(`user:${targetId}`).emit("call:answer", {
      from: socket.userId,
      answer,
      roomId,
    });
  });

  socket.on("call:ice-candidate", ({ targetId, candidate, roomId }) => {
    io.to(`user:${targetId}`).emit("call:ice-candidate", {
      from: socket.userId,
      candidate,
      roomId,
    });
  });
};

export { registerVideoHandlers };
