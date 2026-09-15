"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShopFilters } from "./ShopFilters";

interface ShopToolbarProps {
  brands: string[];
  colors: string[];
  total: number;
  showing: number;
}

export function ShopToolbar({ brands, colors, total, showing }: ShopToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const currentSort = searchParams.get("sort") || "latest";

  const updateSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "latest") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/shop?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/shop?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <>
      <div className={isPending ? "opacity-60" : ""}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {showing} of {total} watches
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>

            <Select value={currentSort} onValueChange={updateSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="best-selling">Best Selling</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search watches by name, brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="luxury" size="sm">
            Search
          </Button>
        </form>
      </div>

      <ShopFilters
        brands={brands}
        colors={colors}
        mobileOpen={mobileFiltersOpen}
        onMobileClose={() => setMobileFiltersOpen(false)}
      />
    </>
  );
}
