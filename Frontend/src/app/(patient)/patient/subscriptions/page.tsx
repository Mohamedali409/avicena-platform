"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPlans,
  getActiveSubscription,
  subscribe,
  cancelSubscription,
  type Plan,
} from "@/features/subscriptions/api";

const PLAN_LABEL: Record<string, string> = {
  free: "المجانية",
  basic: "الأساسية",
  premium: "المميزة",
};

const featureRows = (p: Plan) => [
  { ok: true, label: `${p.features.maxConsultationsPerMonth} استشارة شهريًا` },
  { ok: p.features.chatEnabled, label: "محادثة نصية" },
  { ok: p.features.videoCallEnabled, label: "مكالمات فيديو" },
  { ok: p.features.prioritySupport, label: "دعم بأولوية" },
];

export default function PatientSubscriptionsPage() {
  const qc = useQueryClient();
  const { data: plans = [] } = useQuery({ queryKey: ["plans"], queryFn: getPlans });
  const { data: active } = useQuery({
    queryKey: ["active-subscription"],
    queryFn: getActiveSubscription,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["active-subscription"] });
  };

  const sub = useMutation({ mutationFn: subscribe, onSuccess: invalidate });
  const cancel = useMutation({ mutationFn: cancelSubscription, onSuccess: invalidate });

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="text-headline-md text-on-surface">الاشتراك</h1>

      {/* Current */}
      {active && active.status === "active" && (
        <div className="flex items-center justify-between rounded-xl bg-primary-container p-6 text-white shadow-card">
          <div>
            <p className="text-caption text-white/80">خطتك الحالية</p>
            <p className="text-headline-md">{PLAN_LABEL[active.plan] ?? active.plan}</p>
            {active.expiresAt && (
              <p className="mt-1 text-caption text-white/80">
                تنتهي في {new Date(active.expiresAt).toLocaleDateString("ar-EG")}
              </p>
            )}
          </div>
          {active.plan !== "free" && (
            <button
              onClick={() => cancel.mutate()}
              disabled={cancel.isPending}
              className="rounded-xl bg-white/15 px-4 py-2 text-label-md text-white transition-colors hover:bg-white/25 disabled:opacity-40"
            >
              إلغاء
            </button>
          )}
        </div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((p) => {
          const current = active?.status === "active" && active.plan === p.key;
          const highlight = p.key === "premium";
          return (
            <div
              key={p.key}
              className={`flex flex-col rounded-xl p-6 shadow-card ${
                highlight ? "border-2 border-primary bg-white" : "bg-white"
              }`}
            >
              <p className="text-headline-md text-on-surface">
                {PLAN_LABEL[p.key] ?? p.key}
              </p>
              <p className="mt-2 text-headline-lg text-primary">
                {p.price === 0 ? "مجانًا" : `${p.price} ج.م`}
                {p.price > 0 && (
                  <span className="text-caption text-on-surface-variant"> / شهر</span>
                )}
              </p>

              <ul className="mt-4 flex-1 space-y-2">
                {featureRows(p).map((f, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-2 text-caption ${
                      f.ok ? "text-on-surface" : "text-on-surface-variant line-through"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        f.ok ? "text-primary" : "text-outline"
                      }`}
                    >
                      {f.ok ? "check_circle" : "cancel"}
                    </span>
                    {f.label}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => sub.mutate(p.key)}
                disabled={current || sub.isPending}
                className={`mt-6 rounded-xl py-3 text-label-md transition-all disabled:opacity-50 ${
                  highlight
                    ? "bg-primary-container text-white hover:opacity-90"
                    : "border border-outline-variant text-primary hover:bg-surface-container-low"
                }`}
              >
                {current ? "خطتك الحالية" : "اشترك"}
              </button>
            </div>
          );
        })}
      </div>

      {sub.isError && (
        <p className="text-center text-caption text-error">
          تعذّر إتمام الاشتراك (قد تحتاج الخطط المدفوعة عملية دفع غير مفعّلة بعد).
        </p>
      )}
    </div>
  );
}
