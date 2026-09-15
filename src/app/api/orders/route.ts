import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Order, Product, Coupon } from "@/models";

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RS-${timestamp}-${random}`;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const isAdmin = session.user.role === "admin";
    const query = isAdmin ? {} : { userId: session.user.id };

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({
      orders: JSON.parse(JSON.stringify(orders)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Orders GET error:", error);

    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json(
        { orders: [], total: 0, page: 1, totalPages: 0 },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    const {
      items,
      customer,
      shippingAddress,
      deliveryMethod = "standard",
      paymentMethod,
      couponCode,
    } = body;

    if (!items?.length || !customer || !shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: "Items, customer, shipping address, and payment method are required" },
        { status: 400 }
      );
    }

    if (paymentMethod !== "easypaisa" && paymentMethod !== "cod") {
      return NextResponse.json(
        { error: "Payment method must be EasyPaisa or Cash on Delivery" },
        { status: 400 }
      );
    }

    await connectDB();

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const price = product.discountPrice ?? product.price;
      orderItems.push({
        productId: product._id,
        name: product.name,
        image: product.images[0],
        price,
        quantity: item.quantity,
        color: item.color || product.color,
      });

      subtotal += price * item.quantity;
    }

    const shipping = deliveryMethod === "express" ? 1500 : 500;
    // const tax = Math.round(subtotal * 0.05);
    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        active: true,
        expiryDate: { $gt: new Date() },
      });

      if (coupon) {
        if (!coupon.maxUsage || coupon.usageCount < coupon.maxUsage) {
          discount = Math.round(subtotal * (coupon.discountPercent / 100));
          await Coupon.findByIdAndUpdate(coupon._id, {
            $inc: { usageCount: 1 },
          });
        }
      }
    }

    const total = subtotal + shipping - discount;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: session?.user?.id || undefined,
      items: orderItems,
      customer,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      subtotal,
      shipping,
      // tax,
      discount,
      total,
      couponCode: couponCode?.toUpperCase(),
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    return NextResponse.json(
      { order: JSON.parse(JSON.stringify(order)) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Orders POST error:", error);

    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json(
        { error: "Database unavailable. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
