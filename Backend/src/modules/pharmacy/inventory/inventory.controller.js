import { successResponse } from "../../../shared/utils/ApiResponse.js";
import catchAsync from "../../../shared/utils/catchAsync.js";
import { parsePagination } from "../../../shared/utils/pagination.js";
import * as inventoryService from "./inventory.service.js";

// ── Pharmacy: inventory management ────────────────────────
const listInventory = catchAsync(async (req, res) => {
  const { limit, skip, page } = parsePagination(req.query);
  const { items, total } = await inventoryService.listInventory(
    req.pharmacyId,
    { limit, skip },
  );
  successResponse(res, "المخزون", { items, total, page, limit });
});

const addOrUpdateItem = catchAsync(async (req, res) => {
  const item = await inventoryService.addOrUpdateItem(req.pharmacyId, req.body);
  successResponse(res, "تم حفظ العنصر في المخزون", { item }, 201);
});

const removeItem = catchAsync(async (req, res) => {
  await inventoryService.removeItem(req.pharmacyId, req.params.productId);
  successResponse(res, "تم حذف العنصر من المخزون");
});

// ── Pharmacy: Excel import ────────────────────────────────
const previewImport = catchAsync(async (req, res) => {
  const result = await inventoryService.previewImport(
    req.pharmacyId,
    req.file,
    req.body.mode,
  );
  // don't leak the full parsed rows to the client
  const { _rows, ...safe } = result;
  successResponse(res, "معاينة الاستيراد", safe);
});

const applyImport = catchAsync(async (req, res) => {
  const batch = await inventoryService.applyImport(
    req.pharmacyId,
    req.body.batchId,
    req.file,
    req.body.mode,
  );
  successResponse(res, "تم تطبيق الاستيراد", { batch });
});

const listImportBatches = catchAsync(async (req, res) => {
  const batches = await inventoryService.listImportBatches(req.pharmacyId);
  successResponse(res, "سجل عمليات الاستيراد", { batches });
});

// ── Patient: prescription search ──────────────────────────
const searchByMedicine = catchAsync(async (req, res) => {
  const result = await inventoryService.findPharmaciesForMedicine(
    req.query.medicine,
  );
  successResponse(res, "الصيدليات المتاحة", result);
});

const searchByReport = catchAsync(async (req, res) => {
  const result = await inventoryService.findPharmaciesForReport(
    req.params.reportId,
  );
  successResponse(res, "توافر أدوية الروشتة", result);
});

export {
  listInventory,
  addOrUpdateItem,
  removeItem,
  previewImport,
  applyImport,
  listImportBatches,
  searchByMedicine,
  searchByReport,
};
