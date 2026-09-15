"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/shop?filter=newArrival", label: "New Arrivals" },
    { href: "/shop?filter=bestSeller", label: "Best Sellers" },
    { href: "/shop?category=luxury", label: "Luxury" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="font-display text-2xl font-bold tracking-wider">
          <span className="text-gold-gradient">RH Collection</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Link href="/dashboard/wishlist">
            <Button variant="ghost" size="icon" className="relative" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black">
                  {wishlistItems.length}
                </span>
              )}
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {session ? (
            <div className="relative hidden md:block group">
              <Button variant="ghost" size="sm" className="gap-1">
                <User className="h-4 w-4" />
                <span className="max-w-[80px] truncate">{session.user?.name}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              <div className="invisible absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-white/10 bg-card py-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-gold/10 hover:text-gold">
                  Dashboard
                </Link>
                <Link href="/dashboard/orders" className="block px-4 py-2 text-sm hover:bg-gold/10 hover:text-gold">
                  My Orders
                </Link>
                <Link href="/dashboard/profile" className="block px-4 py-2 text-sm hover:bg-gold/10 hover:text-gold">
                  Profile
                </Link>
                {session.user?.role === "admin" && (
                  <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-gold/10 hover:text-gold">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gold/10 hover:text-gold"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-white/10 px-4 py-3">
          <form action="/shop" className="mx-auto flex max-w-xl gap-2">
            <Input
              name="search"
              placeholder="Search watches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="luxury" size="sm">Search</Button>
          </form>
        </div>
      )}

      <div
        className={cn(
          "overflow-hidden border-t border-white/10 transition-all md:hidden",
          mobileOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-gold/10 hover:text-gold"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!session && (
            <Link href="/login" className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-gold/10 hover:text-gold">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
