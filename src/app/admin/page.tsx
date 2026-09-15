import StatsCards from "@/components/admin/StatsCards";
import { RevenueChart, OrdersStatusChart } from "@/components/admin/RevenueChart";
import { getAdminStats } from "@/lib/admin-stats";
import { toast } from "sonner";
export const metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-gold-gradient">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your luxury watch store performance
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={stats.monthlyRevenue} />
        <OrdersStatusChart data={stats.ordersByStatus} />
      </div>
      <div>
      
      </div>
    </div>
  );
}
