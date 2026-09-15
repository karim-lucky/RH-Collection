import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { Button } from "@/components/ui/button";
import { getProducts, getBrands } from "@/lib/products";
import { demoProducts } from "@/lib/demo-data";

const PAGE_SIZE = 12;

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key === "page") return;
      const v = Array.isArray(value) ? value[0] : value;
      if (v) params.set(key, v);
    });
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={currentPage <= 1}
        className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
      >
        <Link href={buildHref(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (p) =>
              p === 1 ||
              p === totalPages ||
              Math.abs(p - currentPage) <= 1
          )
          .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
            if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
              acc.push("ellipsis");
            }
            acc.push(p);
            return acc;
          }, [])
          .map((item, idx) =>
            item === "ellipsis" ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={item}
                variant={item === currentPage ? "luxury" : "ghost"}
                size="sm"
                asChild
                className="min-w-9"
              >
                <Link href={buildHref(item)}>{item}</Link>
              </Button>
            )
          )}
      </div>

      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={currentPage >= totalPages}
        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
      >
        <Link href={buildHref(currentPage + 1)}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const filter = getParam(params, "filter");
  const page = Math.max(1, parseInt(getParam(params, "page") || "1", 10));

  const filters = {
    brand: getParam(params, "brand"),
    category: getParam(params, "category"),
    gender: getParam(params, "gender"),
    strapType: getParam(params, "strapType"),
    color: getParam(params, "color"),
    minPrice: getParam(params, "minPrice")
      ? parseInt(getParam(params, "minPrice")!, 10)
      : undefined,
    maxPrice: getParam(params, "maxPrice")
      ? parseInt(getParam(params, "maxPrice")!, 10)
      : undefined,
    inStock: getParam(params, "inStock") === "true" ? true : undefined,
    search: getParam(params, "search"),
    sort: getParam(params, "sort"),
    page,
    limit: PAGE_SIZE,
    ...(filter === "newArrival" ? { newArrival: true } : {}),
    ...(filter === "bestSeller" ? { bestSeller: true } : {}),
  };

  const isSaleFilter = filter === "sale";

  const [{ products: fetchedProducts, total: fetchedTotal }, brands] = await Promise.all([
    getProducts(
      isSaleFilter
        ? { ...filters, page: 1, limit: 1000 }
        : filters
    ),
    getBrands(),
  ]);

  const saleProducts = isSaleFilter
    ? fetchedProducts.filter((p) => p.discountPrice && p.discountPrice < p.price)
    : fetchedProducts;

  const total = isSaleFilter ? saleProducts.length : fetchedTotal;
  const displayProducts = isSaleFilter
    ? saleProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : fetchedProducts;

  const colors = [...new Set(demoProducts.map((p) => p.color))].sort();
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const pageTitle =
    filter === "newArrival"
      ? "New Arrivals"
      : filter === "bestSeller"
        ? "Best Sellers"
        : isSaleFilter
          ? "On Sale"
          : "Shop";

  const pageSubtitle =
    filter === "newArrival"
      ? "Discover our latest timepiece masterpieces"
      : filter === "bestSeller"
        ? "Our most loved watches, chosen by customers"
        : isSaleFilter
          ? "Exclusive deals on premium watches"
          : "Explore our complete collection of luxury timepieces";

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 text-center md:mb-12">
          <h1 className="font-display text-4xl font-bold md:text-5xl">{pageTitle}</h1>
          <p className="mt-3 text-muted-foreground">{pageSubtitle}</p>
        </div>

        <div className="flex gap-8">
          <ShopFilters brands={brands} colors={colors} />

          <div className="min-w-0 flex-1">
            <Suspense fallback={<div className="h-24 animate-pulse rounded-xl bg-card" />}>
              <ShopToolbar
                brands={brands}
                colors={colors}
                total={total}
                showing={displayProducts.length}
              />
            </Suspense>

            {displayProducts.length === 0 ? (
              <div className="mt-16 flex flex-col items-center justify-center rounded-xl border border-white/10 bg-card py-20 text-center">
                <p className="font-display text-xl font-semibold">No watches found</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
                <Button variant="luxury" className="mt-6" asChild>
                  <Link href="/shop">Clear all filters</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {displayProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  searchParams={params}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Shop | Rehmat Watches",
  description: "Browse our exclusive collection of luxury timepieces.",
};
