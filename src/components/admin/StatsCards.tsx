import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

const cards = [
  {
    key: "totalSales" as const,
    label: "Total Sales",
    icon: DollarSign,
    format: (v: number) => formatPrice(v),
  },
  {
    key: "totalOrders" as const,
    label: "Total Orders",
    icon: ShoppingCart,
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: "totalCustomers" as const,
    label: "Customers",
    icon: Users,
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: "totalProducts" as const,
    label: "Products",
    icon: Package,
    format: (v: number) => v.toLocaleString(),
  },
];

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, format }) => (
        <Card key={key} className="luxury-border bg-card/50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
              <Icon className="h-6 w-6 text-gold" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="font-display text-2xl font-semibold text-foreground">
                {format(stats[key])}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
