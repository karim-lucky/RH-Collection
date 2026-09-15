import Image from "next/image";
import { Instagram } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const instagramImages = [
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80",
  "https://images.unsplash.com/photo-1547996160-81dfa62995e0?w=400&q=80",
  "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400&q=80",
  "https://images.unsplash.com/photo-1611395917755-60603fecd90c?w=400&q=80",
  "https://images.unsplash.com/photo-1522312346375-d1a52e9bdea0?w=400&q=80",
  "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&q=80",
];

export function NewsletterSection() {
  return (
    <section className="border-t border-white/10 bg-card py-16">
      <div className="mx-auto max-w-xl px-4 text-center">
        <h2 className="font-display text-3xl font-bold">Join Our Exclusive Circle</h2>
        <p className="mt-2 text-muted-foreground">
          Be the first to know about new arrivals, exclusive offers, and watch care tips.
        </p>
        <form className="mt-8 flex gap-2">
          <Input type="email" placeholder="Enter your email" className="flex-1" required />
          <Button type="submit" variant="luxury">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}

export function InstagramGallery() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-center justify-center gap-2">
          <Instagram className="h-5 w-5 text-gold" />
          <h2 className="font-display text-2xl font-bold">@rehmatwatches</h2>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-4">
          {instagramImages.map((img, i) => (
            <a
              key={i}
              href="#"
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={img}
                alt={`Instagram post ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Instagram className="h-6 w-6 text-white" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
