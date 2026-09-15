import { connectDB } from "./mongodb";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { Banner } from "@/models/Banner";
import { Coupon } from "@/models/Coupon";
import { demoProducts, demoBanners } from "./demo-data";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Banner.deleteMany({}),
    Coupon.deleteMany({}),
  ]);

  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  await User.create([
    {
      name: "Admin",
      email: "admin@rehmatwatches.com",
      phone: "+923365884894",
      password: adminPassword,
      role: "admin",
    },
    {
      name: "Test User",
      email: "user@rehmatwatches.com",
      phone: "+923365884894",
      password: userPassword,
      role: "user",
    },
  ]);

  console.log("✅ Users created (admin@rehmatwatches.com / admin123)");

  await Product.insertMany(
    demoProducts.map(({ _id, createdAt, updatedAt, ...product }) => product)
  );
  console.log(`✅ ${demoProducts.length} products created`);

  await Banner.insertMany(
    demoBanners.map(({ _id, ...banner }) => banner)
  );
  console.log(`✅ ${demoBanners.length} banners created`);

  await Coupon.create([
    {
      code: "WELCOME10",
      discountPercent: 10,
      expiryDate: new Date("2026-12-31"),
      active: true,
      maxUsage: 100,
    },
    {
      code: "LUXURY20",
      discountPercent: 20,
      expiryDate: new Date("2026-06-30"),
      active: true,
      maxUsage: 50,
    },
  ]);
  console.log("✅ Coupons created (WELCOME10, LUXURY20)");

  console.log("🎉 Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
