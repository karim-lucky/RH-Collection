import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Banner } from "@/models/Banner";
import { getDemoBanners, setDemoBanners } from "@/lib/admin-demo-data";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  try {
    await connectDB();
    const banners = await Banner.find().sort({ order: 1 }).lean();
    return NextResponse.json(JSON.parse(JSON.stringify(banners)));
  } catch {
    return NextResponse.json(getDemoBanners());
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const body = await req.json();

  try {
    await connectDB();
    const banner = await Banner.create(body);
    return NextResponse.json(JSON.parse(JSON.stringify(banner)), { status: 201 });
  } catch {
    const banners = getDemoBanners();
    const newBanner = { ...body, _id: String(Date.now()) };
    setDemoBanners([...banners, newBanner]);
    return NextResponse.json(newBanner, { status: 201 });
  }
}
