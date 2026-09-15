import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getDemoOrders } from "@/lib/admin-demo-data";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(JSON.parse(JSON.stringify(orders)));
  } catch {
    return NextResponse.json(getDemoOrders());
  }
}

export async function PATCH(req: NextRequest) {
  return NextResponse.json({ error: "Use /api/admin/orders/[id]" }, { status: 400 });
}
