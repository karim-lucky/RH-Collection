"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Banknote,
  CreditCard,
  Loader2,
  Package,
  Smartphone,
  Truck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  cn,
  formatPrice,
  // calculateTax,
  getShippingCost,
  generateOrderNumber,
} from "@/lib/utils";
import type { DeliveryMethod } from "@/types";

type CheckoutPaymentMethod = "easypaisa" | "cod";

const deliveryOptions: {
  value: DeliveryMethod;
  label: string;
  description: string;
  icon: typeof Truck;
}[] = [
  {
    value: "standard",
    label: "Standard Delivery",
    description: "5–7 business days",
    icon: Truck,
  },
  {
    value: "express",
    label: "Express Delivery",
    description: "2–3 business days",
    icon: Zap,
  },
];

const paymentOptions: {
  value: CheckoutPaymentMethod;
  label: string;
  description: string;
  icon: typeof CreditCard;
}[] = [
  {
    value: "easypaisa",
    label: "EasyPaisa",
    description:
      "Send payment to 0306-5957096 (karim ullah - EasyPaisa). Share screenshot on WhatsApp after payment.",
    icon: Smartphone,
  },
  {
    value: "cod",
    label: "Cash on Delivery",
    description: "Pay when you receive your order",
    icon: Banknote,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>("cod");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "Pakistan",
    province: "",
    city: "",
    address: "",
    postalCode: "",
  });

  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        name: session.user?.name || prev.name,
        email: session.user?.email || prev.email,
      }));
    }
  }, [session]);

  const shipping = getShippingCost(deliveryMethod);
  // const tax = calculateTax(subtotal);
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    setLoading(true);

    try {
      const orderNumber = generateOrderNumber();
      const orderData = {
        orderNumber,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          color: item.color,
        })),
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
        },
        shippingAddress: {
          country: form.country,
          province: form.province,
          city: form.city,
          address: form.address,
          postalCode: form.postalCode,
        },
        deliveryMethod,
        paymentMethod,
        subtotal,
        shipping,
        // tax,
        discount: 0,
        total,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to place order");
        return;
      }

      if ((paymentMethod as string) === "easypaisa") {
        clearCart();
        toast.success("Order placed successfully! Please complete the payment via EasyPaisa.");
        return;
      }

      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order-success?orderNumber=${orderNumber}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center lg:px-8">
        <h1 className="font-display text-3xl font-semibold">No Items to Checkout</h1>
        <p className="mt-3 text-muted-foreground">
          Add some watches to your cart before checking out.
        </p>
        <Button variant="luxury" size="lg" className="mt-8" asChild>
          <Link href="/shop">Browse Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h1 className="font-display text-3xl font-semibold md:text-4xl">
        <span className="text-gold-gradient">Checkout</span>
      </h1>
      <p className="mt-2 text-muted-foreground">
        Complete your order details below
      </p>

      <form onSubmit={handlePlaceOrder} className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province / State</Label>
                <Input
                  id="province"
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl">Delivery Method</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {deliveryOptions.map((option) => {
                const Icon = option.icon;
                const cost = getShippingCost(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDeliveryMethod(option.value)}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-4 text-left transition-all",
                      deliveryMethod === option.value
                        ? "border-gold bg-gold/10"
                        : "border-white/10 hover:border-gold/30"
                    )}
                  >
                    <Icon
                      className={cn(
                        "mt-0.5 h-5 w-5",
                        deliveryMethod === option.value
                          ? "text-gold"
                          : "text-muted-foreground"
                      )}
                    />
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                      <p className="mt-1 text-sm text-gold">{formatPrice(cost)}</p>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPaymentMethod(option.value)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all",
                      paymentMethod === option.value
                        ? "border-gold bg-gold/10"
                        : "border-white/10 hover:border-gold/30"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        paymentMethod === option.value
                          ? "text-gold"
                          : "text-muted-foreground"
                      )}
                    />
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-display text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-60 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="line-clamp-1 font-medium">{item.name}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-gold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-white/10 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (5%)</span>
                  <span>{formatPrice(tax)}</span>
                </div> */}
                <div className="flex justify-between border-t border-white/10 pt-2 text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="luxury"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/cart">Back to Cart</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
