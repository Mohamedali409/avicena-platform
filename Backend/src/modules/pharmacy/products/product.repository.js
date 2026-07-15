import Product from "./product.model.js";

const createProduct = (data) => Product.create(data);

const findByBarcode = (barcode) =>
  Product.findOne({ barcode: barcode?.trim() });

const findById = (id) => Product.findById(id);

const findByIds = (ids) => Product.find({ _id: { $in: ids } });

const findByName = (name) =>
  Product.findOne({ name: new RegExp(`${escapeRegex(name?.trim())}$`, "i") });

const search = ({ q, category, limit = 20, skip = 0 }) => {
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (q) {
    const rx = new RegExp(escapeRegex(q.trim()), "i");
    filter.$or = [{ name: rx }, { activeIngredient: rx }, { barcode: rx }];
  }
  return Product.find(filter).limit(limit).skip(skip).sort({ name: 1 });
};

const findAlternatives = (product, limit = 10) => {
  const or = [];
  if (product.activeIngredient)
    or.push({ activeIngredient: product.activeIngredient });

  if (product.category) or.push({ category: product.category });
  if (!or.length) return Promise.resolve([]);
  return Product.find({
    _id: { $ne: product._id },
    isActive: true,
    $or: or,
  }).limit(limit);
};

const upsertByBarcode = (barcode, data) =>
  Product.findOneAndUpdate(
    { barcode: barcode?.trim() },
    { $set: data, $setOnInsert: { barcode: barcode?.trim() } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

const updateProduct = (id, data) =>
  Product.findByIdAndUpdate(id, data, { new: true });

function escapeRegex(str = "") {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export {
  createProduct,
  findByBarcode,
  findById,
  findByIds,
  findByName,
  search,
  findAlternatives,
  upsertByBarcode,
  updateProduct,
  escapeRegex,
};
