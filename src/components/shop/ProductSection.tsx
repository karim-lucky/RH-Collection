import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}

export function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref = "/shop",
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">{title}</h2>
            {subtitle && (
              <p className="mt-2 text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <Button variant="ghost" asChild className="hidden md:flex">
            <Link href={viewAllHref}>
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href={viewAllHref}>View All</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function CollectionsSection() {
  const collections = [
    {
      title: "Men's Collection",
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
      href: "/shop?gender=men",
    },
    {
      title: "Women's Collection",
      image: "https://images.unsplash.com/photo-1547996160-81dfa62995e0?w=600&q=80",
      href: "/shop?gender=women",
    },
    {
      title: "Luxury Edition",
      image: "https://images.unsplash.com/photo-1611395917755-60603fecd90c?w=600&q=80",
      href: "/shop?category=luxury",
    },
  ];

  return (
    <section className="bg-card py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
          Featured Collections
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Curated selections for every style
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {collections.map((col) => (
            <Link
              key={col.title}
              href={col.href}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl"
            >
              <Image
                src={col.image}
                alt={col.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl font-bold text-white">{col.title}</h3>
                <p className="mt-2 flex items-center gap-1 text-sm text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  Explore <ArrowRight className="h-4 w-4" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
