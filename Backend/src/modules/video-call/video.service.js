import * as videoRepo from "./video.repository.js";
import { buildRoomId } from "../chat/chat.service.js";
import ApiError from "../../shared/utils/ApiError.js";

const initiateCall = async ({
  callerId,
  callerType,
  receiverId,
  receiverType,
  consultationId,
  type,
}) => {
  const roomId = `call_${buildRoomId(callerId, receiverId)}`;
  const call = await videoRepo.createCall({
    roomId,
    callerId,
    callerType,
    receiverId,
    receiverType,
    consultationId,
    type: type || "video",
    status: "ringing",
  });

  return call;
};

const acceptCall = async (callId) => {
  const call = await videoRepo.getCallById(callId);
  if (!call) throw new ApiError("The call not found", 404);

  return videoRepo.updateCall(callId, {
    status: "ongoing",
    startedAt: new Date(),
  });
};

const rejectCall = async (callId) => {
  const call = await videoRepo.getCallById(callId);
  if (!call) throw new ApiError("The call not found", 404);

  return videoRepo.updateCall(callId, {
    status: "rejected",
    endedAt: new Date(),
  });
};

const endCall = async (callId) => {
  const call = await videoRepo.getCallById(callId);
  if (!call) throw new ApiError("The call not found", 404);

  const endedAt = new Date();
  const durationInSeconds = call.startedAt
    ? Math.max(0, Math.floor((endedAt - call.startedAt) / 1000))
    : 0;

  return videoRepo.updateCall(callId, {
    status: call.status === "ongoing" ? "ended" : "missed",
    endedAt,
    durationInSeconds,
  });
};

const getCallHistory = async (participantId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  return videoRepo.getCallsForParticipant(participantId, { page, limit });
};

const getCall = async (callId) => {
  const call = await videoRepo.getCallById(callId);
  if (!call) throw new ApiError("The call not found", 404);
  return call;
};

export {
  initiateCall,
  acceptCall,
  rejectCall,
  endCall,
  getCallHistory,
  getCall,
};
