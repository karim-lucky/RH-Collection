import mongoose, { Schema, models } from "mongoose";

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  color: String,
});

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    items: [OrderItemSchema],
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      country: { type: String, required: true },
      province: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    deliveryMethod: {
      type: String,
      enum: ["standard", "express"],
      default: "standard",
    },
    paymentMethod: {
      type: String,
      enum: ["easypaisa", "cod", "bank_transfer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    // tax: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: String,
    stripePaymentId: String,
    trackingNumber: String,
  },
  { timestamps: true }
);

export const Order = models.Order || mongoose.model("Order", OrderSchema);
