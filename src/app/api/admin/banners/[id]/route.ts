import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Banner } from "@/models/Banner";
import { getDemoBanners, setDemoBanners } from "@/lib/admin-demo-data";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const { id } = await params;
  const body = await req.json();

  try {
    await connectDB();
    const banner = await Banner.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!banner) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(JSON.parse(JSON.stringify(banner)));
  } catch {
    const banners = getDemoBanners();
    const index = banners.findIndex((b) => b._id === id);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated = { ...banners[index], ...body };
    banners[index] = updated;
    setDemoBanners([...banners]);
    return NextResponse.json(updated);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const { id } = await params;

  try {
    await connectDB();
    await Banner.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    setDemoBanners(getDemoBanners().filter((b) => b._id !== id));
    return NextResponse.json({ success: true });
  }
}
