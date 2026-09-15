"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/types";

interface HeroSliderProps {
  banners: Banner[];
}

export function HeroSlider({ banners }: HeroSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden md:h-[85vh]">
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {banners.map((banner, index) => (
            <div key={banner._id} className="relative min-w-0 flex-[0_0_100%]">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-xl"
                  >
                    <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">
                      Rehmat Watches
                    </p>
                    <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
                      {banner.title}
                    </h1>
                    {banner.subtitle && (
                      <p className="mt-4 text-lg text-foreground/70 md:text-xl">
                        {banner.subtitle}
                      </p>
                    )}
                    <div className="mt-8 flex flex-wrap gap-4">
                      <Button variant="luxury" size="xl" asChild>
                        <Link href="/shop">
                          Shop Now <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="xl" asChild>
                        <Link href={banner.link || "/shop"}>Explore Collection</Link>
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </section>
  );
}
