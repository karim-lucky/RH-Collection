import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getProducts } from "@/lib/products";
import { Product } from "@/models";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const result = await getProducts({
      brand: searchParams.get("brand") || undefined,
      category: searchParams.get("category") || undefined,
      gender: searchParams.get("gender") || undefined,
      strapType: searchParams.get("strapType") || undefined,
      color: searchParams.get("color") || undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      inStock: searchParams.get("inStock") === "true",
      bestSeller: searchParams.get("bestSeller") === "true",
      newArrival: searchParams.get("newArrival") === "true",
      featured: searchParams.get("featured") === "true",
      search: searchParams.get("search") || undefined,
      sort: searchParams.get("sort") || undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 12,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    if (!body.name || !body.sku || !body.brand || !body.price) {
      return NextResponse.json(
        { error: "Name, SKU, brand, and price are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const slug = body.slug || slugify(body.name);
    const existing = await Product.findOne({
      $or: [{ slug }, { sku: body.sku }],
    });

    if (existing) {
      return NextResponse.json(
        { error: "Product with this slug or SKU already exists" },
        { status: 409 }
      );
    }

    const product = await Product.create({
      ...body,
      slug,
    });

    return NextResponse.json(
      { product: JSON.parse(JSON.stringify(product)) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Products POST error:", error);

    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json(
        { error: "Database unavailable. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
