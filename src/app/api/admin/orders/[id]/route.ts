import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getDemoOrders, setDemoOrders } from "@/lib/admin-demo-data";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const { id } = await params;
  const body = await req.json();

  try {
    await connectDB();
    const order = await Order.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(JSON.parse(JSON.stringify(order)));
  } catch {
    const orders = getDemoOrders();
    const index = orders.findIndex((o) => o._id === id);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated = {
      ...orders[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    orders[index] = updated;
    setDemoOrders([...orders]);
    return NextResponse.json(updated);
  }
}
