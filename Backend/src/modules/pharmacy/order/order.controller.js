import { successResponse } from "../../../shared/utils/ApiResponse.js";
import catchAsync from "../../../shared/utils/catchAsync.js";
import { parsePagination } from "../../../shared/utils/pagination.js";
import * as orderService from "./order.service.js";

// ── Patient ───────────────────────────────────────────────
const createOrder = catchAsync(async (req, res) => {
  const result = await orderService.createOrder(req.userId, req.body);
  successResponse(res, "تم إنشاء الطلب", result, 201);
});

const getMyOrders = catchAsync(async (req, res) => {
  const { limit, skip } = parsePagination(req.query);
  const orders = await orderService.getUserOrders(req.userId, { limit, skip });
  successResponse(res, "طلباتي", { orders });
});

const getMyOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrder(req.params.id, {
    userId: req.userId,
  });
  successResponse(res, "تفاصيل الطلب", { order });
});

const cancelOrder = catchAsync(async (req, res) => {
  const order = await orderService.cancelOrder(
    req.userId,
    req.params.id,
    req.body.reason,
  );
  successResponse(res, "تم إلغاء الطلب", { order });
});

const confirmPayment = catchAsync(async (req, res) => {
  const order = await orderService.confirmPayment(
    req.body.reference || req.query.ref,
  );
  successResponse(res, "تم تأكيد الدفع", { order });
});

// ── Pharmacy ──────────────────────────────────────────────
const getPharmacyOrders = catchAsync(async (req, res) => {
  const { limit, skip } = parsePagination(req.query);
  const orders = await orderService.getPharmacyOrders(req.pharmacyId, {
    status: req.query.status,
    limit,
    skip,
  });
  successResponse(res, "طلبات الصيدلية", { orders });
});

const getPharmacyOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrder(req.params.id, {
    pharmacyId: req.pharmacyId,
  });
  successResponse(res, "تفاصيل الطلب", { order });
});

const updateStatus = catchAsync(async (req, res) => {
  const order = await orderService.updateStatus(
    req.pharmacyId,
    req.params.id,
    req.body.status,
    req.body.note,
  );
  successResponse(res, "تم تحديث حالة الطلب", { order });
});

export {
  createOrder,
  getMyOrders,
  getMyOrder,
  cancelOrder,
  confirmPayment,
  getPharmacyOrders,
  getPharmacyOrder,
  updateStatus,
};
