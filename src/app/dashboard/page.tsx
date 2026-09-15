"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Heart, MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export default function DashboardPage() {
  const { items: wishlistItems } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders?limit=5")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => {});
  }, []);

  const quickLinks = [
    { href: "/dashboard/orders", label: "View Orders", icon: Package, count: orders.length },
    { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart, count: wishlistItems.length },
    { href: "/dashboard/addresses", label: "Addresses", icon: MapPin },
    { href: "/dashboard/profile", label: "Edit Profile", icon: User },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="transition-colors hover:border-gold/30">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                  <link.icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="font-medium">{link.label}</p>
                  {link.count !== undefined && (
                    <p className="text-sm text-muted-foreground">{link.count} items</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display">Recent Orders</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/orders">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Package className="mx-auto h-12 w-12 opacity-30" />
              <p className="mt-4">No orders yet</p>
              <Button variant="luxury" className="mt-4" asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between rounded-lg border border-white/10 p-4"
                >
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold">{formatPrice(order.total)}</p>
                    <span className="text-xs capitalize text-muted-foreground">{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
