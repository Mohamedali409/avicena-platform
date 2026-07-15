import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    barcode: {
      type: String,
      unique: [true, "The bar code must be unique."],
      sparse: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    activeIngredient: { type: String, default: "", trim: true },
    category: {
      type: String,
      default: "Global",
      trim: true,
    },
    from: { type: String, default: "" },
    strength: { type: String, default: "" },
    manufacturer: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String },
    referencePrice: { type: Number, default: 0 },
    requiresPrescription: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true },
);

productSchema.index({ name: "text", activeIngredient: "text" });
productSchema.index({ activeIngredient: 1 });
productSchema.index({ category: 1 });

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
