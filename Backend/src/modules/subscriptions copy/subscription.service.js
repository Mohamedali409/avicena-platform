import SubscriptionModel from "./subscription.model.js";
import UserModel from "../users/user.model.js";
import ApiError from "../../shared/utils/ApiError.js";
import dayjs from "dayjs";

const PLANS = {
  basic:   { price: 99,  durationDays: 30 },
  premium: { price: 199, durationDays: 30 },
};

export const subscribe = async (userId, plan) => {
  if (!PLANS[plan]) throw new ApiError("خطة غير صالحة", 400);

  const { price, durationDays } = PLANS[plan];
  const expiresAt = dayjs().add(durationDays, "day").toDate();

  const subscription = await SubscriptionModel.create({
    userId, plan, price, expiresAt, status: "active",
  });

  await UserModel.findByIdAndUpdate(userId, {
    "subscription.plan": plan,
    "subscription.expiresAt": expiresAt,
  });

  return subscription;
};

export const getActiveSubscription = async (userId) => {
  return SubscriptionModel.findOne({ userId, status: "active" }).sort({ createdAt: -1 });
};

export const cancelSubscription = async (userId) => {
  const sub = await SubscriptionModel.findOne({ userId, status: "active" });
  if (!sub) throw new ApiError("لا يوجد اشتراك نشط", 404);

  await SubscriptionModel.findByIdAndUpdate(sub._id, { status: "cancelled" });
  await UserModel.findByIdAndUpdate(userId, { "subscription.plan": "free" });
};
