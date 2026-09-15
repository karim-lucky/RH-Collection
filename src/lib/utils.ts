import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  amount: number,
  currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "Rs."
) {
  return `${currency} ${amount.toLocaleString()}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RW-${timestamp}-${random}`;
}

export function calculateTax(subtotal: number, rate = 0.05): number {
  return Math.round(subtotal * rate);
}

export function getShippingCost(method: "standard" | "express"): number {
  return method === "express" ? 1500 : 500;
}

export function getEffectivePrice(price: number, discountPrice?: number): number {
  return discountPrice && discountPrice < price ? discountPrice : price;
}

export function getDiscountPercent(price: number, discountPrice?: number): number {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}
