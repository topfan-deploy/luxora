import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  Clock,
  Plus,
  ListOrdered,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, formatOrderNumber } from "@/lib/utils/format";

async function getDashboardData() {
  const [totalRevenue, totalOrders, totalCustomers, totalProducts, recentOrders] =
    await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: "COMPLETED" },
      }),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          _count: { select: { items: true } },
        },
      }),
    ]);

  return {
    totalRevenue: totalRevenue._sum.total || 0,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
  };
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  PROCESSING: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  SHIPPED: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  DELIVERED: "bg-green-500/20 text-green-300 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-300 border-red-500/30",
  REFUNDED: "bg-charcoal-500/20 text-charcoal-300 border-charcoal-500/30",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const data = await getDashboardData();

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(data.totalRevenue),
      icon: DollarSign,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Total Orders",
      value: data.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Total Customers",
      value: data.totalCustomers.toLocaleString(),
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Total Products",
      value: data.totalProducts.toLocaleString(),
      icon: Package,
      color: "text-gold-400",
      bg: "bg-gold-400/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-charcoal-100">Dashboard</h1>
          <p className="text-charcoal-400 text-sm mt-1">
            Overview of your store performance
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-charcoal-400 text-sm">{stat.label}</span>
                <div
                  className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-semibold text-charcoal-100">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-400 text-charcoal-950 rounded-lg text-sm font-semibold hover:bg-gold-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-charcoal-700 text-charcoal-200 rounded-lg text-sm font-medium hover:bg-charcoal-800 hover:border-charcoal-600 transition-colors"
        >
          <ListOrdered className="w-4 h-4" />
          View All Orders
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-charcoal-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-charcoal-400" />
            <h2 className="font-heading text-lg text-charcoal-100">
              Recent Orders
            </h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1"
          >
            View all
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-700/50">
                <th className="text-left text-xs font-medium text-charcoal-400 uppercase tracking-wider px-5 py-3">
                  Order #
                </th>
                <th className="text-left text-xs font-medium text-charcoal-400 uppercase tracking-wider px-5 py-3">
                  Customer
                </th>
                <th className="text-left text-xs font-medium text-charcoal-400 uppercase tracking-wider px-5 py-3">
                  Total
                </th>
                <th className="text-left text-xs font-medium text-charcoal-400 uppercase tracking-wider px-5 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-charcoal-400 uppercase tracking-wider px-5 py-3">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-800">
              {data.recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-charcoal-400 text-sm"
                  >
                    No orders yet
                  </td>
                </tr>
              ) : (
                data.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-charcoal-800/50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm text-gold-400 hover:text-gold-300 font-mono"
                      >
                        {formatOrderNumber(order.orderNumber)}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-sm text-charcoal-200">
                          {order.user.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-charcoal-400">
                          {order.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-charcoal-200">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                          statusColors[order.status] || statusColors.PENDING
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-charcoal-400">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
