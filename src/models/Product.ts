import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    category: {
      type: String,
      enum: ["dress", "sport", "diver", "chronograph", "smart", "luxury"],
      required: true,
    },
    gender: {
      type: String,
      enum: ["men", "women", "unisex"],
      required: true,
    },
    strapType: {
      type: String,
      enum: ["leather", "metal", "rubber", "nylon", "ceramic"],
      required: true,
    },
    color: { type: String, required: true },
    description: { type: String, required: true },
    specifications: {
      movement: String,
      caseSize: String,
      caseMaterial: String,
      waterResistance: String,
      dialColor: String,
      crystal: String,
      warranty: String,
    },
    price: { type: Number, required: true },
    discountPrice: Number,
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String, required: true }],
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", brand: "text", description: "text" });

export const Product = models.Product || mongoose.model("Product", ProductSchema);
