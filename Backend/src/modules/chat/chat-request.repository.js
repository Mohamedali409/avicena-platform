import ChatRequest from "./chat-request.model.js";

// create request
const createRequest = (data) => {
  return ChatRequest.create(data);
};

// last requset to this room
const findLatestByRoomId = (roomId) => {
  return ChatRequest.findOne({ roomId }).sort({ createdAt: -1 });
};

// all doctor request
const findRequestsByDoctor = (docId, status) => {
  const filter = { docId };
  if (status) filter.status = status;
  return ChatRequest.find(filter).sort({ createdAt: -1 });
};

// All patint request
const findRequestsByUser = (userId) => {
  return ChatRequest.find({ userId }).sort({ createdAt: -1 });
};

// update last room request
const updateLatestStatus = (roomId, status, rejectReason = "") => {
  return ChatRequest.findByIdAndUpdate(
    { roomId },
    { status, ...(rejectReason && { rejectReason }) },
    { new: true, sort: { createdAt: -1 } },
  );
};

export {
  createRequest,
  findLatestByRoomId,
  findRequestsByDoctor,
  findRequestsByUser,
  updateLatestStatus,
};
