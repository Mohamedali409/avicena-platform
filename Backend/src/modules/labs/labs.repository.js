import Lab from "./labs.model.js";

const createLabeAccount = (data) => {
  return Lab.create(data);
};

const findLabByEmail = (email) => {
  return Lab.findOne({ email }).select("+password");
};

const getLabCountDocuments = () => {
  return Lab.countDocuments();
};

const findLabs = () => {
  return Lab.find({ isActive: true }).select("-password");
};

const findLabById = (labId) => {
  return Lab.findById(labId).select("-password");
};

const updateLab = (labId, data) => {
  return Lab.findByIdAndUpdate(labId, data, { new: true });
};
export {
  createLabeAccount,
  findLabByEmail,
  getLabCountDocuments,
  findLabs,
  findLabById,
  updateLab,
};
