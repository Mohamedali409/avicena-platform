"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/features/pharmacy/cart.store";
import { createOrder } from "@/features/pharmacy/api";

export default function PatientCartPage() {
  const router = useRouter();
  const cart = useCart();
  const items = cart.items;

  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [payment, setPayment] = useState<"cod" | "online">("cod");
  const [address, setAddress] = useState({ line1: "", city: "", phone: "" });
  const [coupon, setCoupon] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cart.total();

  const submit = async () => {
    if (!cart.pharmacyId || items.length === 0) return;
    if (method === "delivery" && !address.line1.trim()) {
      setError("أدخل عنوان التوصيل");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { order, paymentSession } = await createOrder({
        pharmacyId: cart.pharmacyId,
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        fulfillment: {
          method,
          address: method === "delivery" ? address : undefined,
        },
        payment: { method: payment },
        couponCode: coupon.trim() || undefined,
      });
      cart.clear();
      if (payment === "online" && paymentSession?.checkoutUrl) {
        window.location.href = paymentSession.checkoutUrl;
        return;
      }
      router.replace(`/patient/orders/${order._id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "تعذّر إتمام الطلب");
    } finally {
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <span className="material-symbols-outlined text-[48px] text-outline">shopping_cart</span>
        <p className="mt-2 text-on-surface-variant">سلتك فارغة</p>
        <Link href="/patient/pharmacies" className="mt-4 inline-block text-primary hover:underline">
          ابحث عن دواء
        </Link>
      </div>
    );
  }

  const field = "w-full rounded-lg border border-outline-variant px-3 py-2.5 outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold text-on-surface">السلة</h1>
      <p className="text-caption text-on-surface-variant">من: {cart.pharmacyName}</p>

      {/* Items */}
      <div className="divide-y divide-outline-variant/40 rounded-xl border border-outline-variant/40 bg-white shadow-card">
        {items.map((i) => (
          <div key={i.productId} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="text-label-md text-on-surface">{i.name}</p>
              <p className="text-caption text-on-surface-variant">{i.price} ج.م</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button onClick={() => cart.setQty(i.productId, i.qty - 1)} className="flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant">-</button>
                <span className="w-6 text-center">{i.qty}</span>
                <button onClick={() => cart.setQty(i.productId, i.qty + 1)} className="flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant">+</button>
              </div>
              <button onClick={() => cart.remove(i.productId)} className="text-error hover:opacity-70" aria-label="حذف">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fulfillment */}
      <div className="space-y-4 rounded-xl border border-outline-variant/40 bg-white p-5 shadow-card">
        <div className="flex gap-2">
          {(["delivery", "pickup"] as const).map((m) => (
            <button key={m} onClick={() => setMethod(m)}
              className={`flex-1 rounded-lg py-2 text-label-md transition-colors ${method === m ? "bg-primary-container text-white" : "border border-outline-variant text-on-surface-variant"}`}>
              {m === "delivery" ? "توصيل" : "استلام من الصيدلية"}
            </button>
          ))}
        </div>

        {method === "delivery" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={field} placeholder="العنوان" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
            <input className={field} placeholder="المدينة" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
            <input className={`${field} sm:col-span-2`} dir="ltr" placeholder="رقم الهاتف" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
          </div>
        )}

        <div className="flex gap-2">
          {(["cod", "online"] as const).map((p) => (
            <button key={p} onClick={() => setPayment(p)}
              className={`flex-1 rounded-lg py-2 text-label-md transition-colors ${payment === p ? "bg-primary-container text-white" : "border border-outline-variant text-on-surface-variant"}`}>
              {p === "cod" ? "دفع عند الاستلام" : "دفع أونلاين"}
            </button>
          ))}
        </div>

        <input className={field} placeholder="كوبون خصم (اختياري)" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-outline-variant/40 bg-white p-5 shadow-card">
        <div className="flex justify-between text-label-lg font-bold text-on-surface">
          <span>الإجمالي الفرعي</span><span>{subtotal} ج.م</span>
        </div>
        <p className="mt-1 text-caption text-on-surface-variant">رسوم التوصيل والخصم بتتحسب في الطلب</p>
        {error && <p className="mt-3 rounded-lg bg-error-container p-2 text-caption text-on-error-container">{error}</p>}
        <button onClick={submit} disabled={busy}
          className="mt-4 w-full rounded-lg bg-primary-container py-3 text-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50">
          {busy ? "جارٍ إتمام الطلب…" : "إتمام الطلب"}
        </button>
      </div>
    </div>
  );
}
