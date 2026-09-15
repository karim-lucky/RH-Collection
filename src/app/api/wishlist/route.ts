import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User, Product } from "@/models";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = (await User.findById(session.user.id)
      .populate({ path: "wishlist", model: Product })
      .lean()) as { wishlist?: unknown[] } | null;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      wishlist: JSON.parse(JSON.stringify(user.wishlist || [])),
    });
  } catch (error) {
    console.error("Wishlist GET error:", error);

    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json({ wishlist: [] });
    }

    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const wishlist = user.wishlist || [];
    const index = wishlist.findIndex(
      (id: { toString: () => string }) => id.toString() === productId
    );

    let added: boolean;

    if (index > -1) {
      wishlist.splice(index, 1);
      added = false;
    } else {
      wishlist.push(product._id);
      added = true;
    }

    user.wishlist = wishlist;
    await user.save();

    return NextResponse.json({
      added,
      wishlist: wishlist.map((id: { toString: () => string }) => id.toString()),
    });
  } catch (error) {
    console.error("Wishlist POST error:", error);

    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json(
        { error: "Database unavailable. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}
