import Call from "./call.model.js";

const createCall = async (data) => Call.create(data);

const getCallById = async (id) => Call.findById(id);

const updateCall = async (id, update) => {
  return Call.findByIdAndUpdate(id, update, { new: true });
};

const getCallsForParticipant = async (
  participantId,
  { page = 1, limit = 20 } = {},
) => {
  const skip = (page - 1) * limit;
  return Call.find({
    $or: [{ callerId: participantId }, { receiverId: participantId }],
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export { createCall, getCallById, updateCall, getCallsForParticipant };
