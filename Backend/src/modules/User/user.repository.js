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
<<<<<<< HEAD
=======

const getUserCountDocuments = () => {
  return User.countDocuments();
};

const getUsers = () => {
  return User.find().select("-password -googleId").sort({ createdAt: -1 });
};

const toggleUserStatus = (userId, isActive) => {
  return User.findByIdAndUpdate(userId, { isActive: !isActive }, { new: true });
};
>>>>>>> update
export {
  findAdminByEmailAndRole,
  getUserById,
  updateUserById,
  findByNationalId,
<<<<<<< HEAD
=======
  getUserCountDocuments,
  getUsers,
  toggleUserStatus,
>>>>>>> update
};
