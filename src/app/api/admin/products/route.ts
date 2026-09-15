import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { slugify } from "@/lib/utils";
import {
  getDemoProducts,
  setDemoProducts,
} from "@/lib/admin-demo-data";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(JSON.parse(JSON.stringify(products)));
  } catch {
    return NextResponse.json(getDemoProducts());
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const body = await req.json();

  try {
    await connectDB();
    const product = await Product.create({
      ...body,
      slug: body.slug || slugify(body.name),
    });
    return NextResponse.json(JSON.parse(JSON.stringify(product)), { status: 201 });
  } catch {
    const products = getDemoProducts();
    const newProduct = {
      ...body,
      _id: String(Date.now()),
      slug: body.slug || slugify(body.name),
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDemoProducts([newProduct, ...products]);
    return NextResponse.json(newProduct, { status: 201 });
  }
}
