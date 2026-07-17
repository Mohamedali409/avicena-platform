import ApiError from "../../../shared/utils/ApiError.js";
import * as orderRepository from "./order.repository.js";
import * as inventoryRepository from "../inventory/inventory.repository.js";
import * as productRepository from "../products/product.repository.js";
import * as pharmacyRepository from "../pharmacy/pharmacy.repository.js";
import * as couponService from "../coupon/coupon.service.js";
import { getUserById } from "../../User/user.repository.js";
import { createNotification } from "../../notifications/notification.service.js";
import { queueOrderEmail } from "../../../infrastructure/queue/email.queue.js";
import {
  createPaymentSession,
  verifyPayment,
} from "./order.payment.service.js";

const round = (n) => Math.round(n * 100) / 100;

// ── Create an order ───────────────────────────────────────
const createOrder = async (userId, body) => {
  const { pharmacyId, items, fulfillment, payment, couponCode, reportId } =
    body;

  if (!pharmacyId) throw new ApiError("الصيدلية مطلوبة", 400);
  if (!Array.isArray(items) || !items.length)
    throw new ApiError("لا توجد منتجات في الطلب", 400);
  if (!fulfillment?.method)
    throw new ApiError(
      "طريقة الاستلام مطلوبة (توصيل أو استلام من الصيدلية)",
      400,
    );

  const pharmacy = await pharmacyRepository.findPharmacyById(pharmacyId);
  if (!pharmacy || !pharmacy.isActive || !pharmacy.isVerified)
    throw new ApiError("الصيدلية غير متاحة", 404);

  // Delivery/pickup config is optional on the pharmacy schema. Treat missing
  // config as "available" (fee 0). Add a `delivery`/`pickup` sub-doc to
  // pharmacy.model.js to make these configurable per pharmacy.
  const deliveryCfg = pharmacy.delivery || {};
  const pickupCfg = pharmacy.pickup || {};
  if (fulfillment.method === "delivery" && deliveryCfg.available === false)
    throw new ApiError("هذه الصيدلية لا توفر خدمة التوصيل", 400);
  if (fulfillment.method === "pickup" && pickupCfg.available === false)
    throw new ApiError("هذه الصيدلية لا توفر الاستلام من الفرع", 400);

  // Build validated line items from the pharmacy's inventory (never trust
  // client prices). Verify availability + stock.
  const lineItems = [];
  for (const requested of items) {
    const qty = Number(requested.qty) || 0;
    if (qty < 1) throw new ApiError("كمية غير صالحة", 400);

    const inv = await inventoryRepository.findOne(
      pharmacyId,
      requested.productId,
    );
    if (!inv || !inv.isAvailable)
      throw new ApiError("أحد المنتجات غير متاح في هذه الصيدلية", 400);
    if (inv.stock < qty)
      throw new ApiError("الكمية المطلوبة غير متوفرة في المخزون", 400);

    const product = await productRepository.findById(requested.productId);
    lineItems.push({
      productId: product._id,
      name: product.name,
      category: product.category,
      price: inv.price,
      qty,
      lineTotal: round(inv.price * qty),
    });
  }

  const subtotal = round(lineItems.reduce((s, i) => s + i.lineTotal, 0));

  // Coupon
  let discount = 0;
  let coupon = null;
  if (couponCode) {
    const result = await couponService.computeDiscount({
      pharmacyId,
      code: couponCode,
      userId,
      items: lineItems,
      subtotal,
    });
    discount = result.discount;
    coupon = result.coupon;
  }

  // Delivery fee + min order
  let deliveryFee = 0;
  if (fulfillment.method === "delivery") {
    if (subtotal < (deliveryCfg.minOrder || 0))
      throw new ApiError(`الحد الأدنى للتوصيل هو ${deliveryCfg.minOrder}`, 400);
    deliveryFee = deliveryCfg.fee || 0;
  }

  const total = round(subtotal - discount + deliveryFee);

  // Reserve stock atomically; roll back on partial failure.
  const decremented = [];
  for (const item of lineItems) {
    const ok = await inventoryRepository.decrementStock(
      pharmacyId,
      item.productId,
      item.qty,
    );
    if (!ok) {
      for (const done of decremented)
        await inventoryRepository.incrementStock(
          pharmacyId,
          done.productId,
          done.qty,
        );
      throw new ApiError("نفد مخزون أحد المنتجات، حاول مرة أخرى", 409);
    }
    decremented.push(item);
  }

  const paymentMethod = payment?.method === "online" ? "online" : "cod";

  let order;
  try {
    order = await orderRepository.createOrder({
      userId,
      pharmacyId,
      reportId: reportId || null,
      items: lineItems.map(({ category, ...rest }) => rest),
      subtotal,
      discount,
      couponCode: coupon ? coupon.code : "",
      deliveryFee,
      total,
      fulfillment: {
        method: fulfillment.method,
        address: fulfillment.address || {},
        etaMinutes:
          fulfillment.method === "delivery" ? deliveryCfg.etaMinutes || 0 : 0,
      },
      payment: { method: paymentMethod, status: "pending" },
      status: "pending",
      statusHistory: [{ status: "pending", at: new Date() }],
    });
  } catch (err) {
    // creation failed — release the reserved stock
    for (const done of decremented)
      await inventoryRepository.incrementStock(
        pharmacyId,
        done.productId,
        done.qty,
      );
    throw err;
  }

  // Commit coupon usage now that the order exists.
  if (coupon)
    await couponService.commitRedemption(coupon, userId, order._id, discount);

  // Online payment: create a checkout session.
  let paymentSession = null;
  if (paymentMethod === "online") {
    paymentSession = await createPaymentSession(order);
    order = await orderRepository.updateOrder(order._id, {
      "payment.provider": paymentSession.provider,
      "payment.reference": paymentSession.reference,
    });
  }

  await notifyOrderPlaced(order, pharmacy, userId).catch(() => {});

  return { order, paymentSession };
};

// ── Payment confirmation (demo/webhook) ───────────────────
const confirmPayment = async (reference) => {
  const order = await orderRepository.findByReference(reference);
  if (!order) throw new ApiError("لا يوجد طلب بهذا المرجع", 404);

  const ok = await verifyPayment(reference);
  if (!ok) throw new ApiError("فشل التحقق من الدفع", 400);

  const updated = await orderRepository.updateOrder(order._id, {
    "payment.status": "paid",
    status: order.status === "pending" ? "confirmed" : order.status,
  });
  return updated;
};

// ── Reads ─────────────────────────────────────────────────
const getUserOrders = (userId, opts) =>
  orderRepository.findByUser(userId, opts);

const getPharmacyOrders = (pharmacyId, opts) =>
  orderRepository.findByPharmacy(pharmacyId, opts);

const getOrder = async (id, { userId, pharmacyId } = {}) => {
  const order = await orderRepository.findById(id);
  if (!order) throw new ApiError("الطلب غير موجود", 404);
  if (userId && String(order.userId) !== String(userId))
    throw new ApiError("غير مصرح لك", 403);
  if (
    pharmacyId &&
    String(order.pharmacyId._id || order.pharmacyId) !== String(pharmacyId)
  )
    throw new ApiError("غير مصرح لك", 403);
  return order;
};

// ── Pharmacy: advance order status ────────────────────────
const VALID_STATUSES = [
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
];

const updateStatus = async (pharmacyId, orderId, status, note) => {
  if (!VALID_STATUSES.includes(status))
    throw new ApiError("حالة غير صالحة", 400);

  const order = await orderRepository.findById(orderId);
  if (!order) throw new ApiError("الطلب غير موجود", 404);
  if (String(order.pharmacyId._id || order.pharmacyId) !== String(pharmacyId))
    throw new ApiError("غير مصرح لك", 403);

  // Cancelling restocks the items.
  if (status === "cancelled" && order.status !== "cancelled") {
    for (const item of order.items)
      await inventoryRepository.incrementStock(
        pharmacyId,
        item.productId,
        item.qty,
      );
  }

  const patch = {
    status,
    $push: { statusHistory: { status, at: new Date(), note: note || "" } },
  };
  // COD is settled on completion.
  if (status === "completed" && order.payment.method === "cod")
    patch["payment.status"] = "paid";

  const updated = await orderRepository.updateOrder(orderId, patch);

  await createNotification({
    recipientId: order.userId,
    recipientType: "user",
    type: "order",
    title: "تحديث حالة الطلب",
    message: `طلبك ${order.orderNumber} أصبح: ${statusLabel(status)}`,
    data: { orderId: order._id, status },
  }).catch(() => {});

  return updated;
};

// ── Patient: cancel own order (only before it's being prepared) ──
const cancelOrder = async (userId, orderId, reason) => {
  const order = await orderRepository.findById(orderId);
  if (!order) throw new ApiError("الطلب غير موجود", 404);
  if (String(order.userId) !== String(userId))
    throw new ApiError("غير مصرح لك", 403);
  if (!["pending", "confirmed"].includes(order.status))
    throw new ApiError("لا يمكن إلغاء الطلب في هذه المرحلة", 400);

  for (const item of order.items)
    await inventoryRepository.incrementStock(
      order.pharmacyId._id || order.pharmacyId,
      item.productId,
      item.qty,
    );

  const updated = await orderRepository.updateOrder(orderId, {
    status: "cancelled",
    cancelReason: reason || "",
    $push: {
      statusHistory: {
        status: "cancelled",
        at: new Date(),
        note: reason || "",
      },
    },
  });

  await createNotification({
    recipientId: order.pharmacyId._id || order.pharmacyId,
    recipientType: "pharmacy",
    type: "order",
    title: "إلغاء طلب",
    message: `تم إلغاء الطلب ${order.orderNumber} من قبل المريض`,
    data: { orderId: order._id },
  }).catch(() => {});

  return updated;
};

// ── Helpers ───────────────────────────────────────────────
async function notifyOrderPlaced(order, pharmacy, userId) {
  // In-app to the pharmacy
  await createNotification({
    recipientId: pharmacy._id,
    recipientType: "pharmacy",
    type: "order",
    title: "طلب جديد",
    message: `لديك طلب جديد ${order.orderNumber} بقيمة ${order.total}`,
    data: { orderId: order._id },
  });

  // In-app to the patient
  await createNotification({
    recipientId: userId,
    recipientType: "user",
    type: "order",
    title: "تم استلام طلبك",
    message: `تم إنشاء طلبك ${order.orderNumber} بنجاح`,
    data: { orderId: order._id },
  });

  // Email to the patient
  const user = await getUserById(userId);
  if (user?.email)
    queueOrderEmail(user.email, user.name, {
      orderNumber: order.orderNumber,
      pharmacyName: pharmacy.pharmacyName,
      total: order.total,
      method: order.fulfillment.method,
      items: order.items,
    }).catch(() => {});
}

function statusLabel(status) {
  const map = {
    confirmed: "مؤكد",
    preparing: "قيد التحضير",
    ready: "جاهز للاستلام",
    out_for_delivery: "خرج للتوصيل",
    completed: "مكتمل",
    cancelled: "ملغي",
    pending: "قيد الانتظار",
  };
  return map[status] || status;
}

export {
  createOrder,
  confirmPayment,
  getUserOrders,
  getPharmacyOrders,
  getOrder,
  updateStatus,
  cancelOrder,
};
