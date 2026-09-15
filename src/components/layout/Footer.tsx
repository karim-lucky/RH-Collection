import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="font-display text-2xl font-bold">
              <span className="text-gold-gradient">REHMAT</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Crafting timeless luxury timepieces since 1990. Each watch tells a story of
              precision, elegance, and uncompromising quality.
            </p>
            <div className="mt-6 flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-gold">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {[
                { href: "/shop", label: "Shop All" },
                { href: "/shop?filter=newArrival", label: "New Arrivals" },
                { href: "/shop?filter=bestSeller", label: "Best Sellers" },
                { href: "/shop?category=luxury", label: "Luxury Collection" },
                { href: "/dashboard/wishlist", label: "Wishlist" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-gold">Customer Service</h3>
            <ul className="mt-4 space-y-3">
              {[
                { href: "/dashboard/orders", label: "Track Order" },
                { href: "#", label: "Shipping Info" },
                { href: "#", label: "Returns & Exchanges" },
                { href: "#", label: "Warranty" },
                { href: "#", label: "FAQ" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-gold">Newsletter</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form className="mt-4 flex gap-2">
              <Input type="email" placeholder="Your email" className="flex-1" />
              <Button type="submit" variant="luxury" size="sm">Join</Button>
            </form>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" /> +03365884894
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" /> info@rehmatwatches.com
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" /> Karachi, Pakistan
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Rehmat Watches. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-gold">Privacy Policy</Link>
            <Link href="#" className="hover:text-gold">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
