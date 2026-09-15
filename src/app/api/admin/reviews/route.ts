import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { getDemoReviews, setDemoReviews } from "@/lib/admin-demo-data";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  try {
    await connectDB();
    const reviews = await Review.find()
      .populate("productId", "name")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(JSON.parse(JSON.stringify(reviews)));
  } catch {
    return NextResponse.json(getDemoReviews());
  }
}

export async function PATCH(req: NextRequest) {
  return NextResponse.json({ error: "Use /api/admin/reviews/[id]" }, { status: 400 });
}
