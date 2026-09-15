import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary" | "destructive" | "outline" | "gold";
}>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "border-transparent bg-gold text-black",
    secondary: "border-transparent bg-white/10 text-foreground",
    destructive: "border-transparent bg-red-600 text-white",
    outline: "text-foreground border border-white/20",
    gold: "border-transparent bg-gold/20 text-gold",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
