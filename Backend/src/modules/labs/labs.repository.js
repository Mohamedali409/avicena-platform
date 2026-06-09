import Lab from "./labs.model.js";

const findLabByEmail = (email) => {
  return Lab.findOne({ email }).select("+password");
};

const getLabCountDocuments = () => {
  return Lab.countDocuments();
};

export { findLabByEmail, getLabCountDocuments };
