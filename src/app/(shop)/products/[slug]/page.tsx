import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ArrowLeft } from "lucide-react";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductDetails } from "@/components/shop/ProductDetails";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductBySlug, getProducts } from "@/lib/products";
import { demoReviews } from "@/lib/demo-data";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Rehmat Watches`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const productReviews = demoReviews.filter((r) => r.productId === product._id);

  const { products: relatedProducts } = await getProducts({
    category: product.category,
    limit: 4,
  });
  const filteredRelated = relatedProducts.filter((p) => p._id !== product._id).slice(0, 4);

  const specEntries = Object.entries(product.specifications).filter(
    ([, value]) => value
  );

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>
        </Button>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} productName={product.name} />
          <ProductDetails product={product} />
        </div>

        <div className="mt-16">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-6">
              <div className="rounded-xl border border-white/10 bg-card p-6">
                <h2 className="font-display text-xl font-semibold">Technical Details</h2>
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  {specEntries.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col rounded-lg border border-white/5 bg-background/50 px-4 py-3"
                    >
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </dt>
                      <dd className="mt-1 font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="rounded-xl border border-white/10 bg-card p-6">
                <div className="flex flex-wrap items-center gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-4xl font-bold text-gold">
                      {product.rating.toFixed(1)}
                    </span>
                    <div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? "fill-gold text-gold"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Based on {product.reviewCount} reviews
                      </p>
                    </div>
                  </div>
                </div>

                {productReviews.length > 0 ? (
                  <div className="mt-6 space-y-6">
                    {productReviews.map((review) => (
                      <div
                        key={review._id}
                        className="border-b border-white/5 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gold">{review.userName}</p>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < review.rating
                                    ? "fill-gold text-gold"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 text-center text-muted-foreground">
                    No reviews yet for this product. Be the first to share your experience!
                  </p>
                )}

                {demoReviews.length > productReviews.length && productReviews.length === 0 && (
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <p className="mb-4 text-sm text-muted-foreground">
                      What our customers say about Rehmat watches:
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      {demoReviews.slice(0, 2).map((review) => (
                        <div
                          key={review._id}
                          className="rounded-lg border border-white/5 bg-background/50 p-4"
                        >
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < review.rating
                                    ? "fill-gold text-gold"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="mt-2 text-sm leading-relaxed">
                            &ldquo;{review.comment}&rdquo;
                          </p>
                          <p className="mt-2 text-xs font-medium text-gold">
                            {review.userName}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {filteredRelated.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              You May Also Like
            </h2>
            <p className="mt-2 text-muted-foreground">
              More from our {product.category} collection
            </p>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredRelated.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
