import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Coupon } from "@/models";

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }

    if (!subtotal || subtotal <= 0) {
      return NextResponse.json(
        { error: "Valid subtotal is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    }).lean() as {
      code: string;
      discountPercent: number;
      expiryDate: Date;
      active: boolean;
      usageCount: number;
      maxUsage?: number;
    } | null;

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: "Invalid coupon code" },
        { status: 404 }
      );
    }

    if (!coupon.active) {
      return NextResponse.json(
        { valid: false, error: "This coupon is no longer active" },
        { status: 400 }
      );
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json(
        { valid: false, error: "This coupon has expired" },
        { status: 400 }
      );
    }

    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      return NextResponse.json(
        { valid: false, error: "This coupon has reached its usage limit" },
        { status: 400 }
      );
    }

    const discountAmount = Math.round(
      subtotal * (coupon.discountPercent / 100)
    );

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
      },
      discountAmount,
      finalSubtotal: subtotal - discountAmount,
    });
  } catch (error) {
    console.error("Coupon validate error:", error);

    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json(
        { valid: false, error: "Coupon validation unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
