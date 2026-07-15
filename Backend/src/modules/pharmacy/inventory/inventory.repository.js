import Inventory from "./inventory.model.js";
import ImportBatch from "./import-batch.model.js";

const upsert = (pharmacyId, productId, data) =>
  Inventory.findOneAndUpdate(
    { pharmacyId, productId },
    { $set: data },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

const findByPharmacy = (pharmacyId, { limit = 50, skip = 0, q } = {}) => {
  const query = Inventory.find({ pharmacyId })
    .populate("productId")
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(skip);
  return query;
};

const countByPharmacy = (pharmacyId) =>
  Inventory.countDocuments({ pharmacyId });

const findOne = (pharmacyId, productId) =>
  Inventory.findOne({ pharmacyId, productId });

const findById = (id) => Inventory.findById(id).populate("productId");

const removeItem = (pharmacyId, productId) =>
  Inventory.findOneAndDelete({ pharmacyId, productId });

// Pharmacies that currently stock a given product (available + in stock).
const findPharmaciesStocking = (productIds) =>
  Inventory.find({
    productId: { $in: productIds },
    isAvailable: true,
    stock: { $gt: 0 },
  })
    .populate("productId")
    .populate("pharmacyId", "-password");

// Atomically decrement stock; only succeeds if enough stock remains.
const decrementStock = (pharmacyId, productId, qty) =>
  Inventory.findOneAndUpdate(
    { pharmacyId, productId, stock: { $gte: qty } },
    { $inc: { stock: -qty } },
    { new: true },
  );

const incrementStock = (pharmacyId, productId, qty) =>
  Inventory.findOneAndUpdate(
    { pharmacyId, productId },
    { $inc: { stock: qty } },
    { new: true },
  );

// Deactivate every inventory row of a pharmacy NOT touched by a batch
// (used by "replace" mode).
const deactivateMissing = (pharmacyId, batchId) =>
  Inventory.updateMany(
    { pharmacyId, lastBatchId: { $ne: batchId } },
    { $set: { isAvailable: false } },
  );

// ── Import batches ────────────────────────────────────────
const createBatch = (data) => ImportBatch.create(data);
const updateBatch = (id, data) =>
  ImportBatch.findByIdAndUpdate(id, data, { new: true });
const findBatchesByPharmacy = (pharmacyId) =>
  ImportBatch.find({ pharmacyId }).sort({ createdAt: -1 }).limit(30);

export {
  upsert,
  findByPharmacy,
  countByPharmacy,
  findOne,
  findById,
  removeItem,
  findPharmaciesStocking,
  decrementStock,
  incrementStock,
  deactivateMissing,
  createBatch,
  updateBatch,
  findBatchesByPharmacy,
};
