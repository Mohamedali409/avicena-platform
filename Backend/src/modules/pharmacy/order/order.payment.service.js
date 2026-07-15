import { customAlphabet } from "nanoid";

const genRef = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 24);

// ── Online payment abstraction ────────────────────────────
// This is a pluggable stub. It creates a payment reference and a hosted
// checkout URL that the client redirects to. To go live, wire the existing
// Stripe/Paymob services here (create a PaymentIntent / payment key and return
// its checkout URL), and confirm via the provider webhook instead of the
// demo confirm endpoint.
export const createPaymentSession = async (order) => {
  const reference = genRef();
  const base = process.env.CLIENT_ORIGIN?.split(",")[0]?.trim() || "";

  // Placeholder checkout URL — replace with the real gateway URL when wiring
  // Stripe/Paymob.
  const checkoutUrl = `${base}/patient/orders/${order._id}/pay?ref=${reference}`;

  return {
    provider: process.env.PAYMENT_PROVIDER || "manual",
    reference,
    checkoutUrl,
    status: "pending",
  };
};

// Called by the confirm endpoint (or, in production, the provider webhook)
// to mark a payment successful. Returns true on success.
export const verifyPayment = async (/* reference, providerPayload */) => {
  // With a real gateway, verify the webhook signature / query the provider
  // for the reference status here. The stub trusts the confirm call.
  return true;
};
