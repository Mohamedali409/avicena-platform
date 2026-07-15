import ApiError from "../../../shared/utils/ApiError.js";
import * as couponRepository from "./coupon.repository.js";

// ── Pharmacy management ───────────────────────────────────
const createCoupon = async (pharmacyId, body) => {
  const { code, type, value, scope, validTo } = body;
  if (!code) throw new ApiError("كود الكوبون مطلوب", 400);
  if (value == null || Number(value) <= 0)
    throw new ApiError("قيمة الخصم يجب أن تكون أكبر من صفر", 400);
  if (type === "percentage" && Number(value) > 100)
    throw new ApiError("نسبة الخصم لا يمكن أن تتجاوز 100%", 400);
  if (!validTo) throw new ApiError("تاريخ انتهاء الكوبون مطلوب", 400);

  const existing = await couponRepository.findByCode(pharmacyId, code);
  if (existing) throw new ApiError("هذا الكود مستخدم بالفعل", 409);

  if (scope === "category" && !body.category)
    throw new ApiError("يجب تحديد الفئة عند اختيار نطاق الفئة", 400);
  if (scope === "product" && !body.productId)
    throw new ApiError("يجب تحديد المنتج عند اختيار نطاق المنتج", 400);

  return couponRepository.createCoupon({
    pharmacyId,
    code: code.toUpperCase().trim(),
    type: type || "percentage",
    value: Number(value),
    scope: scope || "all",
    category: body.category || "",
    productId: body.productId || null,
    minOrder: Number(body.minOrder) || 0,
    maxDiscount: Number(body.maxDiscount) || 0,
    validFrom: body.validFrom ? new Date(body.validFrom) : new Date(),
    validTo: new Date(validTo),
    maxUses: Number(body.maxUses) || 0,
    maxUsesPerUser: Number(body.maxUsesPerUser) || 1,
  });
};

const listCoupons = (pharmacyId) => couponRepository.findByPharmacy(pharmacyId);

const updateCoupon = async (id, pharmacyId, body) => {
  const coupon = await couponRepository.updateCoupon(id, pharmacyId, body);
  if (!coupon) throw new ApiError("الكوبون غير موجود", 404);
  return coupon;
};

const deleteCoupon = async (id, pharmacyId) => {
  const removed = await couponRepository.deleteCoupon(id, pharmacyId);
  if (!removed) throw new ApiError("الكوبون غير موجود", 404);
};

// ── Validation + discount computation (shared with orders) ─
// `items` = [{ productId, category, lineTotal }]. Returns { coupon, discount }.
const computeDiscount = async ({
  pharmacyId,
  code,
  userId,
  items,
  subtotal,
}) => {
  const coupon = await couponRepository.findByCode(pharmacyId, code);
  if (!coupon || !coupon.isActive) throw new ApiError("الكوبون غير صالح", 400);

  const now = new Date();
  if (coupon.validFrom && now < coupon.validFrom)
    throw new ApiError("الكوبون لم يُفعّل بعد", 400);
  if (coupon.validTo && now > coupon.validTo)
    throw new ApiError("انتهت صلاحية الكوبون", 400);

  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses)
    throw new ApiError("تم استنفاد عدد مرات استخدام الكوبون", 400);

  if (userId) {
    const used = await couponRepository.countUserRedemptions(
      coupon._id,
      userId,
    );
    if (used >= coupon.maxUsesPerUser)
      throw new ApiError("لقد استخدمت هذا الكوبون بالحد الأقصى المسموح", 400);
  }

  if (coupon.minOrder && subtotal < coupon.minOrder)
    throw new ApiError(
      `الحد الأدنى للطلب لاستخدام الكوبون هو ${coupon.minOrder}`,
      400,
    );

  // Base amount the discount applies to, depending on scope.
  let base = subtotal;
  if (coupon.scope === "category") {
    base = items
      .filter((i) => i.category === coupon.category)
      .reduce((s, i) => s + i.lineTotal, 0);
  } else if (coupon.scope === "product") {
    base = items
      .filter((i) => String(i.productId) === String(coupon.productId))
      .reduce((s, i) => s + i.lineTotal, 0);
  }

  if (base <= 0)
    throw new ApiError("الكوبون لا ينطبق على المنتجات في طلبك", 400);

  let discount =
    coupon.type === "percentage" ? (base * coupon.value) / 100 : coupon.value;

  if (coupon.type === "percentage" && coupon.maxDiscount > 0)
    discount = Math.min(discount, coupon.maxDiscount);

  discount = Math.min(discount, subtotal);
  discount = Math.round(discount * 100) / 100;

  return { coupon, discount };
};

const commitRedemption = async (coupon, userId, orderId, discount) => {
  await couponRepository.incrementUsed(coupon._id);
  await couponRepository.recordRedemption({
    couponId: coupon._id,
    userId,
    orderId,
    discountApplied: discount,
  });
};

export {
  createCoupon,
  listCoupons,
  updateCoupon,
  deleteCoupon,
  computeDiscount,
  commitRedemption,
};
