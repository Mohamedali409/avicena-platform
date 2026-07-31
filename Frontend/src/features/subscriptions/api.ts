import { api } from "@/lib/api/client";

// Subscriptions client. Mirrors /api/subscriptions/*.
// Plans are static (free/basic/premium); a subscription is the user's active row.

export interface PlanFeatures {
  maxConsultationsPerMonth: number;
  videoCallEnabled: boolean;
  chatEnabled: boolean;
  prioritySupport: boolean;
}

export interface Plan {
  key: string; // "free" | "basic" | "premium"
  price: number;
  durationDays: number | null;
  features: PlanFeatures;
}

export interface Subscription {
  _id: string;
  plan: string;
  price: number;
  features: PlanFeatures;
  startDate: string;
  expiresAt?: string;
  status: "active" | "expired" | "cancelled";
}

// GET /api/subscriptions/plans → { plans: { free, basic, premium } } (object, keyed)
export const getPlans = async (): Promise<Plan[]> => {
  const { data } = await api.get("/api/subscriptions/plans");
  const obj = (data.plans ?? {}) as Record<string, Omit<Plan, "key">>;
  return Object.entries(obj).map(([key, v]) => ({ key, ...v }));
};

// GET /api/subscriptions/active → { subscription }
export const getActiveSubscription = async (): Promise<Subscription | null> => {
  const { data } = await api.get("/api/subscriptions/active");
  return (data.subscription ?? null) as Subscription | null;
};

// POST /api/subscriptions  { plan }
export const subscribe = async (plan: string) => {
  const { data } = await api.post("/api/subscriptions", { plan });
  return data.subscription as Subscription;
};

// DELETE /api/subscriptions/cancel
export const cancelSubscription = async () => {
  await api.delete("/api/subscriptions/cancel");
};
