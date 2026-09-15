import { HeroSlider } from "@/components/shop/HeroSlider";
import { FeaturesSection } from "@/components/shop/FeaturesSection";
import { ProductSection, CollectionsSection } from "@/components/shop/ProductSection";
import { ReviewsSection } from "@/components/shop/ReviewsSection";
import { NewsletterSection, InstagramGallery } from "@/components/shop/NewsletterSection";
import { getProducts } from "@/lib/products";
import { demoBanners, demoReviews } from "@/lib/demo-data";

export default async function HomePage() {
  const [bestSellers, newArrivals] = await Promise.all([
    getProducts({ bestSeller: true, limit: 4 }),
    getProducts({ newArrival: true, limit: 4 }),
  ]);

  return (
    <>
      <HeroSlider banners={demoBanners} />
      <FeaturesSection />
      <ProductSection
        title="Best Sellers"
        subtitle="Our most loved timepieces"
        products={bestSellers.products}
        viewAllHref="/shop?filter=bestSeller"
      />
      <ProductSection
        title="New Arrivals"
        subtitle="The latest additions to our collection"
        products={newArrivals.products}
        viewAllHref="/shop?filter=newArrival"
      />
      <CollectionsSection />
      <ReviewsSection reviews={demoReviews} />
      <NewsletterSection />
      <InstagramGallery />
    </>
  );
}
