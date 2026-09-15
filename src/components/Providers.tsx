"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <CartProvider>
          <WishlistProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#1a1a1a",
                  border: "1px solid rgba(201, 169, 98, 0.3)",
                  color: "#fff",
                },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
