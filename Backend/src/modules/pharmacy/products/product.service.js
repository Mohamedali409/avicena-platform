import ApiError from "../../../shared/utils/ApiError.js";
import * as productRepository from "./product.repository.js";

const searchProducts = ({ q, category, limit, skip }) =>
  productRepository.search({ q, category, limit, skip });

const getByBarcode = async (barcode) => {
  if (!barcode) throw new ApiError("The barcode is required.", 400);
  const product = await productRepository.findByBarcode(barcode);
  if (!product)
    throw new ApiError("There not found product with this code", 404);
  return product;
};
const getById = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) throw new ApiError("The product not found.", 404);
  return product;
};

const getAlternatives = async (id) => {
  const product = await getById(id);
  const alternatives = await productRepository.findAlternatives(product);
  return { product, alternatives };
};

const createProduct = async (body, imageFile) => {
  const { barcode, name } = body;
  if (!name) throw new ApiError("اسم المنتج مطلوب", 400);

  if (barcode) {
    const existing = await productRepository.findByBarcode(barcode);
    if (existing) return existing;
  }

  const image = imageFile
    ? await uploadImage(imageFile.path, "avicena/products")
    : undefined;

  return productRepository.createProduct({
    barcode: barcode || undefined,
    name,
    activeIngredient: body.activeIngredient || "",
    category: body.category || "Global",
    form: body.form || "",
    strength: body.strength || "",
    manufacturer: body.manufacturer || "",
    description: body.description || "",
    referencePrice: Number(body.referencePrice) || 0,
    requiresPrescription:
      body.requiresPrescription === true ||
      body.requiresPrescription === "true",
    image,
  });
};

const updateProduct = async (id, body, imageFile) => {
  const update = { ...body };
  delete update.barcode;
  if (imageFile)
    update.image = await uploadImage(imageFile.path, "avicena/products");
  const product = await productRepository.updateProduct(id, update);
  if (!product) throw new ApiError("The product not found", 404);
  return product;
};

export {
  searchProducts,
  getByBarcode,
  getById,
  getAlternatives,
  createProduct,
  updateProduct,
};
