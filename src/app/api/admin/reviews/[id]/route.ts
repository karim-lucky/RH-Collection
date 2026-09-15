import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { getDemoReviews, setDemoReviews } from "@/lib/admin-demo-data";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const { id } = await params;
  const body = await req.json();

  try {
    await connectDB();
    const review = await Review.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(JSON.parse(JSON.stringify(review)));
  } catch {
    const reviews = getDemoReviews();
    const index = reviews.findIndex((r) => r._id === id);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated = { ...reviews[index], ...body };
    reviews[index] = updated;
    setDemoReviews([...reviews]);
    return NextResponse.json(updated);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const { id } = await params;

  try {
    await connectDB();
    await Review.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    setDemoReviews(getDemoReviews().filter((r) => r._id !== id));
    return NextResponse.json({ success: true });
  }
}
