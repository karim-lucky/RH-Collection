"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="luxury-border">
      <CardHeader>
        <CardTitle className="font-display text-lg">Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#a0a0a0" fontSize={12} />
              <YAxis
                stroke="#a0a0a0"
                fontSize={12}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "#141414",
                  border: "1px solid rgba(201,169,98,0.3)",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [formatPrice(value), "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#c9a962" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  processing: "#8b5cf6",
  shipped: "#06b6d4",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

interface OrdersStatusChartProps {
  data: { status: string; count: number }[];
}

export function OrdersStatusChart({ data }: OrdersStatusChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    name: d.status.charAt(0).toUpperCase() + d.status.slice(1),
  }));

  return (
    <div>

   
    <Card className="luxury-border">
      <CardHeader>
        <CardTitle className="font-display text-lg">Orders by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="count"
                nameKey="name"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_COLORS[entry.status] || "#c9a962"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#141414",
                  border: "1px solid rgba(201,169,98,0.3)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
      </CardContent>
    </Card>
     

         </div>
  );
}
