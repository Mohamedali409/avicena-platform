import SubscriptionModel from "./subscription.model.js";

export const createSubscription = async (data) =>
  SubscriptionModel.create(data);

export const findActiveByUser = async (userId) =>
  SubscriptionModel.findOne({ userId, status: "active" }).sort({
    createdAt: -1,
  });

export const findById = async (id) => SubscriptionModel.findById(id);

export const updateById = async (id, update) =>
  SubscriptionModel.findByIdAndUpdate(id, update, { new: true });

export const expireOutdatedSubscriptions = async () => {
  return SubscriptionModel.updateMany(
    { status: "active", expiresAt: { $lt: new Date() } },
    { status: "expired" },
  );
};

export const getHistoryByUser = async (userId) =>
  SubscriptionModel.find({ userId }).sort({ createdAt: -1 });
