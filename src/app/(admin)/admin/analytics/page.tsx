"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, Loader2, BarChart3, PieChartIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";

type RevenueByDay = {
  date: string;
  revenue: number;
};

type OrdersByStatus = {
  status: string;
  count: number;
};

type TopProduct = {
  name: string;
  orderCount: number;
};

type RevenueByCategory = {
  category: string;
  revenue: number;
};

type AnalyticsData = {
  revenueByDay: RevenueByDay[];
  ordersByStatus: OrdersByStatus[];
  topProducts: TopProduct[];
  revenueByCategory: RevenueByCategory[];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#eab308",
  PROCESSING: "#3b82f6",
  SHIPPED: "#a855f7",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
  REFUNDED: "#6b7280",
};

const CHART_COLORS = [
  "#d99a2b",
  "#3b82f6",
  "#22c55e",
  "#a855f7",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

const CustomTooltip = ({
  active,
  payload,
  label,
  isCurrency,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  isCurrency?: boolean;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 shadow-lg">
      {label && (
        <p className="text-xs text-charcoal-400 mb-1">{label}</p>
      )}
      {payload.map((entry, i) => (
        <p key={i} className="text-sm text-charcoal-100">
          <span style={{ color: entry.color }}>{entry.name}: </span>
          {isCurrency ? formatPrice(entry.value) : entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || "Failed to load analytics");
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-300">
        {error || "No analytics data available"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl text-charcoal-100">Analytics</h1>
        <p className="text-charcoal-400 text-sm mt-1">
          Store performance insights
        </p>
      </div>

      {/* Revenue Chart - Last 30 Days */}
      <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-gold-400" />
          <h2 className="font-heading text-lg text-charcoal-100">
            Revenue (Last 30 Days)
          </h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
              <XAxis
                dataKey="date"
                stroke="#666666"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#2d2d2d" }}
              />
              <YAxis
                stroke="#666666"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#2d2d2d" }}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                content={<CustomTooltip isCurrency />}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#d99a2b"
                strokeWidth={2}
                dot={{ fill: "#d99a2b", r: 3 }}
                activeDot={{ r: 5, fill: "#d99a2b" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status - Pie Chart */}
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-blue-400" />
            <h2 className="font-heading text-lg text-charcoal-100">
              Orders by Status
            </h2>
          </div>
          <div className="h-72">
            {data.ordersByStatus.length === 0 ? (
              <div className="h-full flex items-center justify-center text-charcoal-400 text-sm">
                No order data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.ordersByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="count"
                    nameKey="status"
                    paddingAngle={2}
                    label={({ name, value }: { name?: string; value?: number }) => `${name || ""}: ${value || 0}`}
                    labelLine={{ stroke: "#666" }}
                    fontSize={11}
                  >
                    {data.ordersByStatus.map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={STATUS_COLORS[entry.status] || "#6b7280"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Selling Products - Bar Chart */}
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-green-400" />
            <h2 className="font-heading text-lg text-charcoal-100">
              Top Selling Products
            </h2>
          </div>
          <div className="h-72">
            {data.topProducts.length === 0 ? (
              <div className="h-full flex items-center justify-center text-charcoal-400 text-sm">
                No product data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.topProducts}
                  layout="vertical"
                  margin={{ left: 10, right: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#2d2d2d"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    stroke="#666666"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: "#2d2d2d" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#666666"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#2d2d2d" }}
                    width={120}
                    tick={{ fill: "#b3b3b3" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="orderCount"
                    name="Orders"
                    fill="#d99a2b"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Revenue by Category - Bar Chart */}
      <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          <h2 className="font-heading text-lg text-charcoal-100">
            Revenue by Category
          </h2>
        </div>
        <div className="h-80">
          {data.revenueByCategory.length === 0 ? (
            <div className="h-full flex items-center justify-center text-charcoal-400 text-sm">
              No category data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                <XAxis
                  dataKey="category"
                  stroke="#666666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#2d2d2d" }}
                  tick={{ fill: "#b3b3b3" }}
                />
                <YAxis
                  stroke="#666666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#2d2d2d" }}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  content={<CustomTooltip isCurrency />}
                />
                <Legend
                  wrapperStyle={{ color: "#8a8a8a", fontSize: 12 }}
                />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                >
                  {data.revenueByCategory.map((_, index) => (
                    <Cell
                      key={index}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
