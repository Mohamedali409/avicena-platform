import User from "../User/user.model.js";
import Doctor from "../doctors/doctor.model.js";
import Lab from "../labs/labs.model.js";

const createUser = (userData) => {
  return User.create(userData);
};

const findUserByEmail = (email) => {
  return User.findOne({ email }).select("+password");
};

const updateUser = (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

const findUserById = (id) => {
  return User.findById(id).select("+password");
};

export { createUser, findUserByEmail, updateUser, findUserById };
