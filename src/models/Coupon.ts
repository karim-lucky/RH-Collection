import mongoose, { Schema, models } from "mongoose";

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountPercent: { type: Number, required: true, min: 1, max: 100 },
    expiryDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
    maxUsage: Number,
  },
  { timestamps: true }
);

export const Coupon = models.Coupon || mongoose.model("Coupon", CouponSchema);
