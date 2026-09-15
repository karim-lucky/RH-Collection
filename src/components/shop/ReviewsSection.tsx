import { Star } from "lucide-react";
import type { Review } from "@/types";

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
          What Our Customers Say
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Trusted by thousands of watch enthusiasts
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-xl border border-white/10 bg-card p-6 transition-colors hover:border-gold/30"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "fill-gold text-gold" : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                &ldquo;{review.comment}&rdquo;
              </p>
              <p className="mt-4 text-sm font-semibold text-gold">{review.userName}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
