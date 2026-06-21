import * as videoService from "./video.service.js";
import * as notificationService from "../notifications/notification.service.js";
import { emitNotification } from "../../infrastructure/socket/socket.server.js";
import { ca } from "zod/locales";

const registerVideoHandlers = (io, socket) => {
  // start call
  socket.on(
    "call:initiate",
    async ({ receiverId, receiverType, consultationId, type }) => {
      try {
        const callerType = socket.role === "doctor" ? "doctor" : "user";
        const call = await videoService.initiateCall({
          callerId: socket.userId,
          callerType,
          receiverId,
          receiverType,
          consultationId,
          type,
        });
        socket.join(call.roomId);

        io.to(`user:${receiverId}`).emit("call:incoming", {
          callerId: call._id,
          roomId: call._id,
          from: socket.userId,
          callerType,
          type: call.type,
        });

        const notification = await notificationService.createNotification({
          recipientId: receiverId,
          recipientType: receiverType,
          type: "consultation",
          title: "Incoming call",
          message: "You have an incoming video call",
          data: { callerId: call._id, roomId: call.roomId },
        });
        emitNotification(receiverId, notification);

        socket.emit("call:initiated", {
          callerId: call._id,
          roomId: call.roomId,
        });
      } catch (error) {
        socket.emit("call:error", { message: error.message });
      }
    },
  );

  // accept call
  socket.on("call-accept", async ({ callId, roomId }) => {
    try {
      const call = await videoService.acceptCall(callId);
      socket.join(roomId);
      io.to(roomId).emit("call:accepted", {
        callId: call._id,
        roomId: call._id,
        from: socket.userId,
      });
    } catch (error) {
      socket.emit("call:error", { message: error.message });
    }
  });

  // reject call
  socket.on("call:reject", async ({ callId, targetId }) => {
    try {
      await videoService.rejectCall(callId);
      io.to(`user:${targetId}`).emit("call:rejected", {
        callId,
        from: socket.userId,
      });
    } catch (error) {
      socket.emit("call:error", { message: error.message });
    }
  });

  // end call
  socket.on("call:end", async ({ callId, roomId, targetId }) => {
    try {
      const call = await videoService.endCall(callId);
      if (roomId) {
        io.to(roomId).emit("call:end", {
          callId,
          from: socket.userId,
          duration: call.durationInSeconds,
        });
      } else if (targetId) {
        io.to(`user:${targetId}`).emit("call:ended", {
          callId,
          from: socket.userId,
        });
      }
    } catch (error) {
      socket.emit("call:ended", { message: error.message });
    }
  });

  socket.on("call:offer", ({ targetId, offer, roomId }) => {
    io.to(`user:${targetId}`).emit("call-offer", {
      from: socket.userId,
      offer,
      roomId,
    });
  });

  socket.on("call:answer", ({ targetId, answer, roomId }) => {
    io.to(`user:${targetId}`).emit("call-answer", {
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
