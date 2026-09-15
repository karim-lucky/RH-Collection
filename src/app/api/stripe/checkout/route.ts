import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { createCheckoutSession } from "@/lib/stripe";
import { Order } from "@/models";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    const { orderId, successUrl, cancelUrl } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const order = (await Order.findById(orderId).lean()) as {
      _id: { toString: () => string };
      userId?: { toString: () => string };
      paymentMethod: string;
      items: { name: string; price: number; quantity: number; image?: string }[];
      customer: { email: string };
    } | null;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isAdmin = session?.user?.role === "admin";
    const isOwner = order.userId?.toString() === session?.user?.id;

    if (order.userId && !isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (order.paymentMethod !== "stripe") {
      return NextResponse.json(
        { error: "Order is not configured for Stripe payment" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;

    const checkoutSession = await createCheckoutSession({
      items: order.items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      orderId: order._id.toString(),
      customerEmail: order.customer.email,
      successUrl: successUrl || `${baseUrl}/checkout/success?orderId=${orderId}`,
      cancelUrl: cancelUrl || `${baseUrl}/checkout?cancelled=true`,
    });

    await Order.findByIdAndUpdate(orderId, {
      stripePaymentId: checkoutSession.id,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json(
        { error: "Database unavailable. Please try again later." },
        { status: 503 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
