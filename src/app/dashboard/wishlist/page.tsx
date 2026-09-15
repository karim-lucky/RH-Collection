"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import type { Product } from "@/types";
import { demoProducts } from "@/lib/demo-data";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const matched = demoProducts.filter((p) => items.includes(p._id));
    setProducts(matched);

    if (items.length > 0) {
      fetch(`/api/products?ids=${items.join(",")}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.products?.length) setProducts(data.products);
        })
        .catch(() => {});
    }
  }, [items]);

  const handleMoveToCart = (product: Product) => {
    const price = getEffectivePrice(product.price, product.discountPrice);
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price,
      quantity: 1,
      color: product.color,
    });
    removeItem(product._id);
    toast.success("Moved to cart");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Heart className="h-5 w-5 text-gold" />
          My Wishlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="py-12 text-center">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">Your wishlist is empty</p>
            <Button variant="luxury" className="mt-6" asChild>
              <Link href="/shop">Discover Watches</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {products.map((product) => {
              const price = getEffectivePrice(product.price, product.discountPrice);
              return (
                <div
                  key={product._id}
                  className="flex gap-4 rounded-xl border border-white/10 p-4"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-medium hover:text-gold">{product.name}</h3>
                      </Link>
                      <p className="text-sm font-bold text-gold">{formatPrice(price)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="luxury"
                        size="sm"
                        onClick={() => handleMoveToCart(product)}
                      >
                        <ShoppingBag className="h-3 w-3" /> Add to Cart
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          removeItem(product._id);
                          toast.success("Removed from wishlist");
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
