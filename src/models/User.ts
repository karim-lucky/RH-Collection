import mongoose, { Schema, models } from "mongoose";

const AddressSchema = new Schema({
  label: String,
  country: { type: String, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  postalCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    image: String,
    addresses: [AddressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    emailVerified: Date,
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model("User", UserSchema);
