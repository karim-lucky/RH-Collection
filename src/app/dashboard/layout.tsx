"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  User,
  MapPin,
  Heart,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "My Orders", icon: Package },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/addresses", label: "Addresses", icon: MapPin },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">
            Welcome, {session?.user?.name || "Guest"}
          </h1>
          <p className="mt-1 text-muted-foreground">Manage your account and orders</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <nav className="space-y-1 rounded-xl border border-white/10 bg-card p-4">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gold/10 text-gold"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </nav>
          </aside>

          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
