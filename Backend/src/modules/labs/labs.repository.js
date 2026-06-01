import Lab from "./labs.model.js";

const findLabByEmail = (email) => {
  return Lab.findOne({ email }).select("+password");
};

export { findLabByEmail };
