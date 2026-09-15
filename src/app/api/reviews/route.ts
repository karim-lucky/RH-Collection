import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { demoReviews } from "@/lib/demo-data";
import { Review, Product } from "@/models";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId query parameter is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const reviews = await Review.find({
      productId,
      approved: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      reviews: JSON.parse(JSON.stringify(reviews)),
    });
  } catch (error) {
    console.error("Reviews GET error:", error);

    const productId = request.nextUrl.searchParams.get("productId");
    const reviews = demoReviews.filter(
      (r) => r.productId === productId && r.approved
    );

    return NextResponse.json({ reviews });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, rating, comment } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: "Product ID, rating, and comment are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const review = await Review.create({
      productId,
      userId: session.user.id,
      userName: session.user.name || "Anonymous",
      rating,
      comment,
      approved: false,
    });

    const allReviews = await Review.find({ productId, approved: true });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    return NextResponse.json(
      {
        review: JSON.parse(JSON.stringify(review)),
        message: "Review submitted and pending approval",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reviews POST error:", error);

    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json(
        { error: "Database unavailable. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
