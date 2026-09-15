"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    },
    []
  );

  const goTo = (index: number) => {
    setActiveIndex((index + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-xl border border-white/10 bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No image</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-card"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={images[activeIndex]}
          alt={`${productName} - image ${activeIndex + 1}`}
          fill
          className={cn(
            "object-cover transition-transform duration-300",
            isZooming && "scale-150"
          )}
          style={
            isZooming
              ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
              : undefined
          }
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        <Button
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => setZoomOpen(true)}
          aria-label="Open zoom view"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                i === activeIndex
                  ? "border-gold shadow-lg shadow-gold/20"
                  : "border-white/10 opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-4xl border-white/10 bg-card p-2">
          <DialogTitle className="sr-only">{productName} zoom view</DialogTitle>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={images[activeIndex]}
              alt={`${productName} - zoomed`}
              fill
              className="object-contain"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
          {images.length > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "relative h-14 w-14 overflow-hidden rounded-md border-2",
                    i === activeIndex ? "border-gold" : "border-white/10"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
