import { NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { demoCustomers } from "@/lib/admin-demo-data";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  try {
    await connectDB();
    const customers = await User.find({ role: "user" })
      .select("name email phone role createdAt wishlist")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(JSON.parse(JSON.stringify(customers)));
  } catch {
    return NextResponse.json(
      demoCustomers.filter((c) => c.role === "user")
    );
  }
}
