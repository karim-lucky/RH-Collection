import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id).select("addresses");
    return NextResponse.json({ addresses: user?.addresses || [] });
  } catch {
    return NextResponse.json({ addresses: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const address = await request.json();
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (address.isDefault) {
      user.addresses.forEach((a: { isDefault?: boolean }) => {
        a.isDefault = false;
      });
    }

    user.addresses.push(address);
    await user.save();

    return NextResponse.json({ addresses: user.addresses });
  } catch (error) {
    console.error("Address add error:", error);
    return NextResponse.json({ error: "Failed to add address" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Address ID required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.addresses = user.addresses.filter(
      (a: { _id?: { toString: () => string } }) => a._id?.toString() !== id
    );
    await user.save();

    return NextResponse.json({ addresses: user.addresses });
  } catch (error) {
    console.error("Address delete error:", error);
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
