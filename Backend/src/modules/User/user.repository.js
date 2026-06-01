import User from "./user.model.js";

const findAdminByEmailAndRole = (email) => {
  return User.findOne({ email }).select("+password");
};

const getUserById = (id) => {
  return User.findById(id).select("-password");
};

const updateUserById = (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true }).select("-password");
};

const findByNationalId = (nationalId) => {
  return User.findOne({ nationalId });
};
export {
  findAdminByEmailAndRole,
  getUserById,
  updateUserById,
  findByNationalId,
};
