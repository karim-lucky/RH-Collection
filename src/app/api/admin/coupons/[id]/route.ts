import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";
import { getDemoCoupons, setDemoCoupons } from "@/lib/admin-demo-data";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const { id } = await params;
  const body = await req.json();

  try {
    await connectDB();
    const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(JSON.parse(JSON.stringify(coupon)));
  } catch {
    const coupons = getDemoCoupons();
    const index = coupons.findIndex((c) => c._id === id);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated = { ...coupons[index], ...body };
    coupons[index] = updated;
    setDemoCoupons([...coupons]);
    return NextResponse.json(updated);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const { id } = await params;

  try {
    await connectDB();
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    setDemoCoupons(getDemoCoupons().filter((c) => c._id !== id));
    return NextResponse.json({ success: true });
  }
}
