import dayjs from "dayjs";
import ApiError from "../../shared/utils/ApiError.js";
import * as subRepo from "./subscription.repository.js";

const PLANS = {
  free: {
    price: 0,
    durationDays: null,
    features: {
      maxConsultationsPerMonth: 1,
      videoCallEnabled: false,
      chatEnabled: true,
      prioritySupport: false,
    },
  },
  basic: {
    price: 99,
    durationDays: 30,
    features: {
      maxConsultationsPerMonth: 5,
      videoCallEnabled: true,
      chatEnabled: true,
      prioritySupport: false,
    },
  },
  premium: {
    price: 199,
    durationDays: 30,
    features: {
      maxConsultationsPerMonth: 999,
      videoCallEnabled: true,
      chatEnabled: true,
      prioritySupport: true,
    },
  },
};

export const getPlans = () => PLANS;

export const subscribe = async (userId, plan, paymentId) => {
  const planDef = PLANS[plan];
  if (!planDef) throw new ApiError("خطة غير صالحة", 400);

  // إلغاء أي اشتراك نشط حالي
  const current = await subRepo.findActiveByUser(userId);
  if (current) {
    await subRepo.updateById(current._id, { status: "cancelled" });
  }

  const expiresAt = planDef.durationDays
    ? dayjs().add(planDef.durationDays, "day").toDate()
    : null;

  const subscription = await subRepo.createSubscription({
    userId,
    plan,
    price: planDef.price,
    features: planDef.features,
    expiresAt,
    status: "active",
    paymentId,
  });

  return subscription;
};

export const getActiveSubscription = async (userId) => {
  await subRepo.expireOutdatedSubscriptions();
  let sub = await subRepo.findActiveByUser(userId);

  if (!sub) {
    // الاشتراك الافتراضي المجاني
    sub = await subRepo.createSubscription({
      userId,
      plan: "free",
      price: 0,
      features: PLANS.free.features,
      status: "active",
    });
  }

  return sub;
};

export const cancelSubscription = async (userId) => {
  const sub = await subRepo.findActiveByUser(userId);
  if (!sub) throw new ApiError("لا يوجد اشتراك نشط", 404);
  if (sub.plan === "free")
    throw new ApiError("لا يمكن إلغاء الخطة المجانية", 400);

  return subRepo.updateById(sub._id, { status: "cancelled" });
};

export const getHistory = async (userId) => subRepo.getHistoryByUser(userId);

export const checkFeatureAccess = async (userId, featureKey) => {
  const sub = await getActiveSubscription(userId);
  return Boolean(sub.features?.[featureKey]);
};
