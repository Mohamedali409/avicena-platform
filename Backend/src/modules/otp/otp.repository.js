import Otp from "./otp.model.js";

const create = (data) => Otp.create(data);

const findById = (id) => Otp.findById(id);

const findOne = (filter) => Otp.findOne(filter);

const find = (filter) => Otp.find(filter);

const update = (id, data) => Otp.findByIdAndUpdate(id, data, { new: true });

const updateOne = (filter, data) =>
  Otp.findOneAndUpdate(filter, data, { new: true });

const deleteOne = (filter) => Otp.deleteOne(filter);

const deleteMany = (filter) => Otp.deleteMany(filter);

/* ---------------- OTP Specific Methods ---------------- */

const findActiveOtp = (userId, type) => {
  return Otp.findOne({
    user: userId,
    type,
    isUsed: false,
  });
};

const markAsUsed = (id) => {
  return Otp.findByIdAndUpdate(
    id,
    {
      isUsed: true,
    },
    {
      new: true,
    },
  );
};

const incrementAttempts = (id) => {
  return Otp.findByIdAndUpdate(
    id,
    {
      $inc: {
        attempts: 1,
      },
    },
    {
      new: true,
    },
  );
};

export {
  create,
  findById,
  findOne,
  find,
  update,
  updateOne,
  deleteOne,
  deleteMany,

  // OTP Methods
  findActiveOtp,
  markAsUsed,
  incrementAttempts,
};
