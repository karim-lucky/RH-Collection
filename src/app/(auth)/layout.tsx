import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,98,0.08)_0%,_transparent_60%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />

      <Link
        href="/"
        className="relative mb-8 font-display text-3xl font-bold tracking-wider transition-opacity hover:opacity-80"
      >
        <span className="text-gold-gradient">REHMAT</span>
      </Link>

      <div className="relative w-full max-w-md">
        <div className="luxury-glow rounded-2xl border border-white/10 bg-card/80 p-8 shadow-2xl backdrop-blur-sm">
          {children}
        </div>
      </div>

      <p className="relative mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Rehmat Watches. All rights reserved.
      </p>
    </div>
  );
}
