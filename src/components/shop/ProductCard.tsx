"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  formatPrice,
  getEffectivePrice,
  getDiscountPercent,
} from "@/lib/utils";
import { getWhatsAppUrl, getProductWhatsAppMessage } from "@/lib/whatsapp";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const price = getEffectivePrice(product.price, product.discountPrice);
  const discount = getDiscountPercent(product.price, product.discountPrice);

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price,
      quantity: 1,
      color: product.color,
    });
    toast.success("Added to cart");
  };

  const handleWishlist = () => {
    toggleItem(product._id);
    toast.success(isInWishlist(product._id) ? "Removed from wishlist" : "Added to wishlist");
  };

  const whatsappUrl = getWhatsAppUrl(
    getProductWhatsAppMessage(product.name, formatPrice(price), 1, product.color)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-card transition-all duration-500 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/10">
        <div className="relative aspect-square overflow-hidden">
          <Link href={`/products/${product.slug}`}>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </Link>

          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {discount > 0 && <Badge variant="gold">-{discount}%</Badge>}
            {product.newArrival && <Badge variant="secondary">New</Badge>}
            {product.bestSeller && <Badge variant="default">Best Seller</Badge>}
          </div>

          <button
            onClick={handleWishlist}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-gold hover:text-black"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-4 w-4 ${isInWishlist(product._id) ? "fill-gold text-gold" : ""}`}
            />
          </button>

          <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-2 bg-gradient-to-t from-black/80 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
            <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="flex-1">
                  <Eye className="h-4 w-4" /> Quick View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">{product.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gold">{formatPrice(price)}</span>
                      {product.discountPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">{product.description.slice(0, 200)}...</p>
                    <div className="flex gap-2">
                      <Button variant="luxury" className="flex-1" onClick={handleAddToCart}>
                        Add to Cart
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/products/${product.slug}`}>Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="luxury" size="sm" className="flex-1" onClick={handleAddToCart}>
              <ShoppingBag className="h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.brand}</p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-1 font-display text-lg font-medium transition-colors hover:text-gold">
              {product.name}
            </h3>
          </Link>
          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-gold text-gold"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gold">{formatPrice(price)}</span>
              {product.discountPrice && (
                <span className="ml-2 text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#25D366] hover:underline"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
