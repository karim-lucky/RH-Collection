"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatPrice,
  calculateTax,
  getShippingCost,
} from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  const shipping = getShippingCost("standard");
  // const tax = calculateTax(subtotal);

  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
            <ShoppingBag className="h-10 w-10 text-gold" />
          </div>
          <h1 className="font-display text-3xl font-semibold">Your Cart is Empty</h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Discover our exquisite collection of luxury timepieces and find the
            perfect watch for your wrist.
          </p>
          <Button variant="luxury" size="lg" className="mt-8" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h1 className="font-display text-3xl font-semibold md:text-4xl">
        Shopping <span className="text-gold-gradient">Cart</span>
      </h1>
      <p className="mt-2 text-muted-foreground">
        {items.length} {items.length === 1 ? "item" : "items"} in your cart
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <Card key={item.productId} className="overflow-hidden">
              <CardContent className="flex gap-4 p-4 sm:gap-6 sm:p-6">
                <Link
                  href={`/products/${item.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-28"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="112px"
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-display text-lg font-medium transition-colors hover:text-gold"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Color: {item.color}
                      </p>
                      <p className="mt-2 font-semibold text-gold">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-red-500"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-md border border-white/10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-none"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-none"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-display text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping (Standard)</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              {/* <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span>{formatPrice(tax)}</span>
              </div> */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>

              <Button variant="luxury" size="lg" className="w-full" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
