import mongoose, { Schema, models } from "mongoose";

const BannerSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    image: { type: String, required: true },
    link: String,
    type: { type: String, enum: ["hero", "promo"], default: "hero" },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Banner = models.Banner || mongoose.model("Banner", BannerSchema);
