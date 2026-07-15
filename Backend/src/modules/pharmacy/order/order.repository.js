import Order from "./order.model.js";

const createOrder = (data) => Order.create(data);

const findById = (id) =>
  Order.findById(id).populate("pharmacyId", "-password").populate("reportId");

const findByUser = (userId, { limit = 20, skip = 0 } = {}) =>
  Order.find({ userId })
    .populate("pharmacyId", "name image phone address")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

const findByPharmacy = (pharmacyId, { status, limit = 30, skip = 0 } = {}) => {
  const filter = { pharmacyId };
  if (status) filter.status = status;
  return Order.find(filter)
    .populate("userId", "name phone image")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

const updateOrder = (id, data) =>
  Order.findByIdAndUpdate(id, data, { new: true });

const findByReference = (reference) =>
  Order.findOne({ "payment.reference": reference });

export {
  createOrder,
  findById,
  findByUser,
  findByPharmacy,
  updateOrder,
  findByReference,
};
