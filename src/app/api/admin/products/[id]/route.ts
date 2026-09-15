import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { getDemoProducts, setDemoProducts } from "@/lib/admin-demo-data";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const { id } = await params;

  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(JSON.parse(JSON.stringify(product)));
  } catch {
    const product = getDemoProducts().find((p) => p._id === id);
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const { id } = await params;
  const body = await req.json();

  try {
    await connectDB();
    const product = await Product.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(JSON.parse(JSON.stringify(product)));
  } catch {
    const products = getDemoProducts();
    const index = products.findIndex((p) => p._id === id);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated = { ...products[index], ...body, updatedAt: new Date().toISOString() };
    products[index] = updated;
    setDemoProducts([...products]);
    return NextResponse.json(updated);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const { id } = await params;

  try {
    await connectDB();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    setDemoProducts(getDemoProducts().filter((p) => p._id !== id));
    return NextResponse.json({ success: true });
  }
}
