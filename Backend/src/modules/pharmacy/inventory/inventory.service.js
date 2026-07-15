import fs from "fs/promises";
import ApiError from "../../../shared/utils/ApiError.js";
import { parseProductSheet } from "../../../infrastructure/excel/excel.service.js";
import * as inventoryRepository from "./inventory.repository.js";
import * as productRepository from "../products/product.repository.js";
import { getReportById } from "../../report/report.repository.js";

// ── Manual / barcode inventory management ─────────────────

const listInventory = async (pharmacyId, { limit, skip } = {}) => {
  const [items, total] = await Promise.all([
    inventoryRepository.findByPharmacy(pharmacyId, { limit, skip }),
    inventoryRepository.countByPharmacy(pharmacyId),
  ]);
  return { items, total };
};

// Add or update a stock row. If `productId` is given, use it. Otherwise
// resolve/create the catalog product by barcode or name first.
const addOrUpdateItem = async (pharmacyId, body) => {
  const { productId, barcode, name, price, stock, isAvailable } = body;

  if (price == null || Number(price) < 0)
    throw new ApiError("السعر مطلوب", 400);

  let product;
  if (productId) {
    product = await productRepository.findById(productId);
  } else if (barcode) {
    product = await productRepository.findByBarcode(barcode);
  }

  // Create a new catalog entry if we couldn't resolve one.
  if (!product) {
    if (!name) throw new ApiError("اسم المنتج أو الباركود مطلوب", 400);
    product = barcode
      ? await productRepository.upsertByBarcode(barcode, {
          name,
          activeIngredient: body.activeIngredient || "",
          category: body.category || "عام",
          form: body.form || "",
          strength: body.strength || "",
          manufacturer: body.manufacturer || "",
        })
      : await productRepository.createProduct({
          name,
          activeIngredient: body.activeIngredient || "",
          category: body.category || "عام",
          form: body.form || "",
          strength: body.strength || "",
          manufacturer: body.manufacturer || "",
        });
  }

  const item = await inventoryRepository.upsert(pharmacyId, product._id, {
    price: Number(price),
    stock: stock != null ? Number(stock) : 0,
    isAvailable: isAvailable != null ? isAvailable : true,
  });

  return inventoryRepository.findById(item._id);
};

const removeItem = async (pharmacyId, productId) => {
  const removed = await inventoryRepository.removeItem(pharmacyId, productId);
  if (!removed) throw new ApiError("العنصر غير موجود في المخزون", 404);
};

// ── Excel import ──────────────────────────────────────────
// Two-step by design: preview builds a batch (status "preview") without
// touching inventory, so the pharmacy can review counts/errors, then apply.

const previewImport = async (pharmacyId, file, mode = "upsert") => {
  if (!file) throw new ApiError("لم يتم رفع أي ملف", 400);

  const { rows, errors } = parseProductSheet(file.path);
  await fs.unlink(file.path).catch(() => {});

  const batch = await inventoryRepository.createBatch({
    pharmacyId,
    filename: file.originalname,
    mode: mode === "replace" ? "replace" : "upsert",
    status: "preview",
    stats: { total: rows.length, failed: errors.length },
    errors,
  });

  return {
    batchId: batch._id,
    mode: batch.mode,
    total: rows.length,
    sample: rows.slice(0, 20),
    errors,
    // Rows are re-parsed on apply; we don't persist the full sheet.
    _rows: rows,
  };
};

// Apply an import. We re-parse from an uploaded file again on apply to keep
// things stateless and avoid storing large payloads.
const applyImport = async (pharmacyId, batchId, file, mode = "upsert") => {
  if (!file) throw new ApiError("لم يتم رفع أي ملف", 400);

  const batch = batchId
    ? await inventoryRepository.updateBatch(batchId, {})
    : null;

  const { rows, errors } = parseProductSheet(file.path);
  await fs.unlink(file.path).catch(() => {});

  const activeBatch =
    batch ||
    (await inventoryRepository.createBatch({
      pharmacyId,
      filename: file.originalname,
      mode: mode === "replace" ? "replace" : "upsert",
      status: "preview",
    }));

  const stats = {
    total: rows.length,
    created: 0,
    updated: 0,
    deactivated: 0,
    failed: errors.length,
  };
  const rowErrors = [...errors];

  for (const row of rows) {
    try {
      // 1) upsert catalog product
      let product;
      if (row.barcode) {
        product = await productRepository.upsertByBarcode(row.barcode, {
          name: row.name,
          activeIngredient: row.activeIngredient,
          category: row.category,
          form: row.form,
          strength: row.strength,
          manufacturer: row.manufacturer,
        });
      } else {
        product =
          (await productRepository.findByName(row.name)) ||
          (await productRepository.createProduct({
            name: row.name,
            activeIngredient: row.activeIngredient,
            category: row.category,
            form: row.form,
            strength: row.strength,
            manufacturer: row.manufacturer,
          }));
      }

      // 2) upsert pharmacy inventory
      const existing = await inventoryRepository.findOne(
        pharmacyId,
        product._id,
      );
      await inventoryRepository.upsert(pharmacyId, product._id, {
        price: row.price,
        stock: row.stock,
        isAvailable: true,
        lastBatchId: activeBatch._id,
      });
      if (existing) stats.updated += 1;
      else stats.created += 1;
    } catch (err) {
      stats.failed += 1;
      rowErrors.push({ row: row.rowNum, reason: err.message });
    }
  }

  // "replace" mode: anything not in this sheet becomes unavailable.
  if (activeBatch.mode === "replace") {
    const res = await inventoryRepository.deactivateMissing(
      pharmacyId,
      activeBatch._id,
    );
    stats.deactivated = res.modifiedCount || 0;
  }

  const updated = await inventoryRepository.updateBatch(activeBatch._id, {
    status: "applied",
    stats,
    errors: rowErrors,
  });

  return updated;
};

const listImportBatches = (pharmacyId) =>
  inventoryRepository.findBatchesByPharmacy(pharmacyId);

// ── Prescription search ───────────────────────────────────
// "Which pharmacies have this medicine?" + alternatives fallback.

const findPharmaciesForMedicine = async (medicineName) => {
  if (!medicineName) throw new ApiError("اسم الدواء مطلوب", 400);

  // 1) match catalog products by free-text name / ingredient
  const products = await productRepository.search({
    q: medicineName,
    limit: 5,
  });

  let matches = [];
  if (products.length) {
    const ids = products.map((p) => p._id);
    matches = await inventoryRepository.findPharmaciesStocking(ids);
  }

  // 2) if nobody stocks the exact medicine, offer alternatives
  let alternatives = [];
  if (!matches.length) {
    const base = products[0];
    if (base) {
      const altProducts = await productRepository.findAlternatives(base);
      if (altProducts.length) {
        const altIds = altProducts.map((p) => p._id);
        alternatives = await inventoryRepository.findPharmaciesStocking(altIds);
      }
    }
  }

  return {
    query: medicineName,
    matchedProducts: products,
    available: shapeOffers(matches),
    alternatives: shapeOffers(alternatives),
  };
};

// Run the search for every treatment line in a report.
const findPharmaciesForReport = async (reportId) => {
  const report = await getReportById(reportId);
  if (!report) throw new ApiError("التقرير غير موجود", 404);

  const results = [];
  for (const t of report.treatment || []) {
    results.push({
      medicine: t.name,
      dosage: t.dosage,
      duration: t.duration,
      ...(await findPharmaciesForMedicine(t.name)),
    });
  }
  return { reportId, items: results };
};

// Flatten inventory rows into { pharmacy, product, price, stock } offers.
function shapeOffers(rows) {
  return rows
    .filter((r) => r.pharmacyId && r.productId)
    .map((r) => ({
      pharmacy: r.pharmacyId,
      product: r.productId,
      price: r.price,
      stock: r.stock,
      inventoryId: r._id,
    }));
}

export {
  listInventory,
  addOrUpdateItem,
  removeItem,
  previewImport,
  applyImport,
  listImportBatches,
  findPharmaciesForMedicine,
  findPharmaciesForReport,
};
