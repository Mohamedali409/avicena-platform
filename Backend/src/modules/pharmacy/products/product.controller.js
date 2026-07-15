import { successResponse } from "../../../shared/utils/ApiResponse";
import catchAsync from "../../../shared/utils/catchAsync.js";
import { parsePagination } from "../../../shared/utils/pagination.js";
import * as productService from "./product.service.js";

const searchProducts = catchAsync(async (req, res) => {
  const { limit, skip } = parsePagination(req.query);
  const products = await productService.searchProducts({
    q: req.query.q,
    category: req.query.category,
    limit,
    skip,
  });
  successResponse(res, "This is the search result ", { products });
});

const getByBarcode = catchAsync(async (req, res) => {
  const product = await productService.getByBarcode(req.params.barcode);
  successResponse(res, "Product", { product });
});

const getById = catchAsync(async (req, res) => {
  const product = await productService.getById(req.params.id);
  successResponse(res, "Product", { product });
});

const getAlternatives = catchAsync(async (req, res) => {
  const result = await productService.getAlternatives(req.params.id);
  successResponse(res, "Alternative product", result);
});

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body, req.file);
  successResponse(res, "Product Added Successfully.", { product }, 201);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.body,
    req.file,
  );
  successResponse(res, "The product updated successfully.", { product });
});

export {
  searchProducts,
  getByBarcode,
  getById,
  getAlternatives,
  createProduct,
  updateProduct,
};
