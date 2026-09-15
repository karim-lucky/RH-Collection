import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { getDemoStats } from "@/lib/admin-demo-data";
import type { DashboardStats } from "@/types";

export async function getAdminStats(): Promise<DashboardStats> {
  try {
    await connectDB();

    const [orders, products, customers] = await Promise.all([
      Order.find({ status: { $ne: "cancelled" } }).select("total status createdAt").lean(),
      Product.countDocuments(),
      User.countDocuments({ role: "user" }),
    ]);

    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = await Order.countDocuments();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyMap[`${d.getFullYear()}-${d.getMonth()}`] = 0;
    }

    orders.forEach((order) => {
      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (key in monthlyMap) {
        monthlyMap[key] += order.total;
      }
    });

    const monthlyRevenue = Object.entries(monthlyMap).map(([key]) => {
      const [, month] = key.split("-").map(Number);
      return { month: monthNames[month], revenue: monthlyMap[key] };
    });

    const statusAgg = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    return {
      totalSales,
      totalOrders,
      totalCustomers: customers,
      totalProducts: products,
      monthlyRevenue,
      ordersByStatus: statusAgg.map((s) => ({ status: s._id, count: s.count })),
    };
  } catch {
    return getDemoStats();
  }
}
