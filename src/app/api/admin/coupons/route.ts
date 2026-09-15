import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";
import { getDemoCoupons, setDemoCoupons } from "@/lib/admin-demo-data";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  try {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(JSON.parse(JSON.stringify(coupons)));
  } catch {
    return NextResponse.json(getDemoCoupons());
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const body = await req.json();

  try {
    await connectDB();
    const coupon = await Coupon.create(body);
    return NextResponse.json(JSON.parse(JSON.stringify(coupon)), { status: 201 });
  } catch {
    const coupons = getDemoCoupons();
    const newCoupon = {
      ...body,
      _id: String(Date.now()),
      code: body.code.toUpperCase(),
      usageCount: 0,
    };
    setDemoCoupons([newCoupon, ...coupons]);
    return NextResponse.json(newCoupon, { status: 201 });
  }
}
