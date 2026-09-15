"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  formatPrice,
  getEffectivePrice,
  getDiscountPercent,
} from "@/lib/utils";
import { getWhatsAppUrl, getOrderWhatsAppMessage } from "@/lib/whatsapp";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const price = getEffectivePrice(product.price, product.discountPrice);
  const discount = getDiscountPercent(product.price, product.discountPrice);
  const inWishlist = isInWishlist(product._id);
  const outOfStock = product.stock <= 0;

  const buildCartItem = () => ({
    productId: product._id,
    name: product.name,
    slug: product.slug,
    image: product.images[0],
    price,
    quantity,
    color: product.color,
  });

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem(buildCartItem());
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addItem(buildCartItem());
    router.push("/cart");
  };

  const handleWishlist = () => {
    toggleItem(product._id);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  const whatsappUrl = getWhatsAppUrl(
    getOrderWhatsAppMessage(
      product.name,
      formatPrice(price),
      product.color,
      quantity
    )
  );

  const adjustQuantity = (delta: number) => {
    setQuantity((q) => Math.max(1, Math.min(product.stock, q + delta)));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          {product.brand}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
          {product.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">SKU: {product.sku}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {discount > 0 && <Badge variant="gold">-{discount}% OFF</Badge>}
        {product.newArrival && <Badge variant="secondary">New Arrival</Badge>}
        {product.bestSeller && <Badge variant="default">Best Seller</Badge>}
        {product.featured && <Badge variant="outline">Featured</Badge>}
        {outOfStock ? (
          <Badge variant="destructive">Out of Stock</Badge>
        ) : (
          <Badge variant="outline" className="border-green-500/50 text-green-500">
            In Stock ({product.stock} available)
          </Badge>
        )}
      </div>

      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl font-bold text-gold">
          {formatPrice(price)}
        </span>
        {product.discountPrice && (
          <span className="text-lg text-muted-foreground line-through">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      <p className="leading-relaxed text-foreground/80">{product.description}</p>

      <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-card/50 p-4 text-sm">
        <div>
          <span className="text-muted-foreground">Category</span>
          <p className="mt-0.5 capitalize font-medium">{product.category}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Gender</span>
          <p className="mt-0.5 capitalize font-medium">{product.gender}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Strap</span>
          <p className="mt-0.5 capitalize font-medium">{product.strapType}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Color</span>
          <p className="mt-0.5 font-medium">{product.color}</p>
        </div>
      </div>

      {!outOfStock && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Quantity</span>
          <div className="flex items-center rounded-md border border-white/10">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => adjustQuantity(-1)}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center text-sm font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => adjustQuantity(1)}
              disabled={quantity >= product.stock}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="luxury"
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={outOfStock}
        >
          <ShoppingBag className="h-5 w-5" />
          Add to Cart
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={handleBuyNow}
          disabled={outOfStock}
        >
          <Zap className="h-5 w-5" />
          Buy Now
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 shrink-0"
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-5 w-5 ${inWishlist ? "fill-gold text-gold" : ""}`}
          />
        </Button>
      </div>

      <Button
        variant="secondary"
        size="lg"
        className="w-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20"
        asChild
        disabled={outOfStock}
      >
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          Order via WhatsApp
        </a>
      </Button>
    </div>
  );
}
