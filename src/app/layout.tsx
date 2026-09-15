import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rehmat Watches | Timeless Luxury On Your Wrist",
    template: "%s | Rehmat Watches",
  },
  description:
    "Discover premium luxury watches at Rehmat Watches. Explore our curated collection of timeless timepieces with free shipping and warranty included.",
  keywords: ["luxury watches", "premium watches", "men watches", "women watches"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Rehmat Watches",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} min-h-screen antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
