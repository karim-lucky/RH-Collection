import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { demoBanners } from "@/lib/demo-data";
import { Banner } from "@/models";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type");
    const activeOnly = searchParams.get("active") !== "false";

    await connectDB();

    const query: Record<string, unknown> = {};
    if (type) query.type = type;
    if (activeOnly) query.active = true;

    const banners = await Banner.find(query).sort({ order: 1 }).lean();

    return NextResponse.json({
      banners: JSON.parse(JSON.stringify(banners)),
    });
  } catch (error) {
    console.error("Banners GET error:", error);

    let banners = [...demoBanners];
    const type = request.nextUrl.searchParams.get("type");
    const activeOnly = request.nextUrl.searchParams.get("active") !== "false";

    if (type) banners = banners.filter((b) => b.type === type);
    if (activeOnly) banners = banners.filter((b) => b.active);

    return NextResponse.json({ banners });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    if (!body.title || !body.image) {
      return NextResponse.json(
        { error: "Title and image are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const banner = await Banner.create(body);

    return NextResponse.json(
      { banner: JSON.parse(JSON.stringify(banner)) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Banners POST error:", error);

    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json(
        { error: "Database unavailable. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
