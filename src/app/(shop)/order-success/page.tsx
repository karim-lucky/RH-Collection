import Link from "next/link";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface OrderSuccessPageProps {
  searchParams: Promise<{ orderNumber?: string }>;
}

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const { orderNumber } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
          <CheckCircle className="h-12 w-12 text-gold" />
        </div>

        <h1 className="font-display text-3xl font-semibold md:text-4xl">
          Thank You for Your <span className="text-gold-gradient">Order</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Your luxury timepiece is on its way. We&apos;ve received your order and
          will begin processing it shortly.
        </p>
      </div>

      {orderNumber && (
        <Card className="mt-10 luxury-glow">
          <CardContent className="p-8 text-center">
            <p className="text-sm uppercase tracking-wider text-muted-foreground">
              Order Number
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-gold">
              {orderNumber}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              A confirmation email has been sent with your order details.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Button variant="luxury" size="lg" className="w-full gap-2" asChild>
          <Link href="/dashboard/orders">
            <Package className="h-4 w-4" />
            View My Orders
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="w-full gap-2" asChild>
          <Link href="/shop">
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      <div className="mt-12 rounded-xl border border-white/10 bg-card/50 p-6">
        <h2 className="font-display text-lg font-semibold">What&apos;s Next?</h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
              1
            </span>
            We&apos;ll send you an email confirmation with your order details.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
              2
            </span>
            Your watch will be carefully packaged and prepared for shipping.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
              3
            </span>
            You&apos;ll receive tracking information once your order ships.
          </li>
        </ul>
      </div>
    </div>
  );
}
