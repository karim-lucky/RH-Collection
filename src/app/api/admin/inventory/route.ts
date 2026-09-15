import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { getDemoProducts, setDemoProducts } from "@/lib/admin-demo-data";

const LOW_STOCK_THRESHOLD = 10;

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  try {
    await connectDB();
    const products = await Product.find()
      .select("name sku brand stock price images")
      .sort({ stock: 1 })
      .lean();
    return NextResponse.json(JSON.parse(JSON.stringify(products)));
  } catch {
    return NextResponse.json(
      getDemoProducts().map(({ _id, name, sku, brand, stock, price, images }) => ({
        _id,
        name,
        sku,
        brand,
        stock,
        price,
        images,
      }))
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const { productId, stock } = await req.json();
  if (!productId || stock === undefined) {
    return NextResponse.json({ error: "productId and stock required" }, { status: 400 });
  }

  try {
    await connectDB();
    const product = await Product.findByIdAndUpdate(
      productId,
      { stock: Number(stock) },
      { new: true }
    ).lean();
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(JSON.parse(JSON.stringify(product)));
  } catch {
    const products = getDemoProducts();
    const index = products.findIndex((p) => p._id === productId);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    products[index] = { ...products[index], stock: Number(stock) };
    setDemoProducts([...products]);
    return NextResponse.json(products[index]);
  }
}

export { LOW_STOCK_THRESHOLD };
