import { NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { getAdminStats } from "@/lib/admin-stats";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const stats = await getAdminStats();
  return NextResponse.json(stats);
}
