"use client";

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Gender, ProductCategory, StrapType } from "@/types";

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "dress", label: "Dress" },
  { value: "sport", label: "Sport" },
  { value: "diver", label: "Diver" },
  { value: "chronograph", label: "Chronograph" },
  { value: "smart", label: "Smart" },
  { value: "luxury", label: "Luxury" },
];

const GENDERS: { value: Gender; label: string }[] = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
];

const STRAP_TYPES: { value: StrapType; label: string }[] = [
  { value: "leather", label: "Leather" },
  { value: "metal", label: "Metal" },
  { value: "rubber", label: "Rubber" },
  { value: "nylon", label: "Nylon" },
  { value: "ceramic", label: "Ceramic" },
];

const PRICE_RANGES = [
  { label: "Under Rs. 50,000", min: 0, max: 50000 },
  { label: "Rs. 50,000 – 100,000", min: 50000, max: 100000 },
  { label: "Rs. 100,000 – 150,000", min: 100000, max: 150000 },
  { label: "Over Rs. 150,000", min: 150000, max: undefined as number | undefined },
];

interface ShopFiltersProps {
  brands: string[];
  colors: string[];
  className?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function ShopFilters({
  brands,
  colors,
  className,
  mobileOpen,
  onMobileClose,
}: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      if (!updates.page) params.delete("page");
      startTransition(() => {
        router.push(`/shop?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  const clearAll = () => {
    startTransition(() => {
      router.push("/shop", { scroll: false });
    });
    onMobileClose?.();
  };

  const currentBrand = searchParams.get("brand") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentGender = searchParams.get("gender") || "";
  const currentStrap = searchParams.get("strapType") || "";
  const currentColor = searchParams.get("color") || "";
  const inStock = searchParams.get("inStock") === "true";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const hasActiveFilters =
    currentBrand ||
    currentCategory ||
    currentGender ||
    currentStrap ||
    currentColor ||
    inStock ||
    minPrice ||
    maxPrice ||
    searchParams.get("filter");

  const filterSection = (
    <div className={cn("space-y-6", isPending && "opacity-60 pointer-events-none")}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <SlidersHorizontal className="h-5 w-5 text-gold" />
          Filters
        </h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-gold">
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label>Brand</Label>
        <Select
          value={currentBrand || "all"}
          onValueChange={(v) => updateParams({ brand: v === "all" ? null : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={currentCategory || "all"}
          onValueChange={(v) => updateParams({ category: v === "all" ? null : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Gender</Label>
        <Select
          value={currentGender || "all"}
          onValueChange={(v) => updateParams({ gender: v === "all" ? null : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {GENDERS.map((g) => (
              <SelectItem key={g.value} value={g.value}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Strap Type</Label>
        <Select
          value={currentStrap || "all"}
          onValueChange={(v) => updateParams({ strapType: v === "all" ? null : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All straps" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All straps</SelectItem>
            {STRAP_TYPES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <Select
          value={currentColor || "all"}
          onValueChange={(v) => updateParams({ color: v === "all" ? null : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All colors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All colors</SelectItem>
            {colors.map((color) => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Price Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => updateParams({ minPrice: e.target.value || null })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => updateParams({ maxPrice: e.target.value || null })}
          />
        </div>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => {
            const isActive =
              minPrice === String(range.min) &&
              (range.max === undefined
                ? !maxPrice
                : maxPrice === String(range.max));
            return (
              <button
                key={range.label}
                type="button"
                onClick={() =>
                  updateParams({
                    minPrice: String(range.min),
                    maxPrice: range.max !== undefined ? String(range.max) : null,
                  })
                }
                className={cn(
                  "w-full rounded-md border px-3 py-2 text-left text-xs transition-colors",
                  isActive
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-white/10 hover:border-gold/30"
                )}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="inStock"
          checked={inStock}
          onCheckedChange={(checked) =>
            updateParams({ inStock: checked ? "true" : null })
          }
        />
        <Label htmlFor="inStock" className="cursor-pointer">
          In stock only
        </Label>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden w-64 shrink-0 lg:block",
          className
        )}
      >
        <div className="sticky top-24 rounded-xl border border-white/10 bg-card p-5">
          {filterSection}
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border border-white/10 bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-lg font-semibold">Filters</span>
              <Button variant="ghost" size="icon" onClick={onMobileClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {filterSection}
            <Button variant="luxury" className="mt-6 w-full" onClick={onMobileClose}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
