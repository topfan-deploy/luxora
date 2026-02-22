import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Run all queries in parallel
    const [
      revenueOrders,
      ordersByStatusRaw,
      topProductsRaw,
      revenueByCategoryRaw,
    ] = await Promise.all([
      // Revenue by day - last 30 days
      prisma.order.findMany({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          paymentStatus: "COMPLETED",
        },
        select: {
          total: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      }),

      // Orders by status
      prisma.order.groupBy({
        by: ["status"],
        _count: { id: true },
      }),

      // Top 10 products by order count
      prisma.orderItem.groupBy({
        by: ["productId", "productName"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),

      // Revenue by category
      prisma.orderItem.findMany({
        where: {
          order: { paymentStatus: "COMPLETED" },
        },
        select: {
          price: true,
          quantity: true,
          product: {
            select: {
              category: {
                select: { name: true },
              },
            },
          },
        },
      }),
    ]);

    // Process revenue by day
    const revenueByDayMap = new Map<string, number>();
    // Initialize all 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      revenueByDayMap.set(key, 0);
    }
    for (const order of revenueOrders) {
      const key = new Date(order.createdAt).toISOString().split("T")[0];
      revenueByDayMap.set(key, (revenueByDayMap.get(key) || 0) + order.total);
    }
    const revenueByDay = Array.from(revenueByDayMap.entries()).map(
      ([date, revenue]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue: Math.round(revenue * 100) / 100,
      })
    );

    // Process orders by status
    const ordersByStatus = ordersByStatusRaw.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));

    // Process top products
    const topProducts = topProductsRaw.map((item) => ({
      name:
        item.productName.length > 25
          ? item.productName.substring(0, 25) + "..."
          : item.productName,
      orderCount: item._count.id,
    }));

    // Process revenue by category
    const categoryRevenueMap = new Map<string, number>();
    for (const item of revenueByCategoryRaw) {
      const categoryName = item.product.category.name;
      const itemRevenue = item.price * item.quantity;
      categoryRevenueMap.set(
        categoryName,
        (categoryRevenueMap.get(categoryName) || 0) + itemRevenue
      );
    }
    const revenueByCategory = Array.from(categoryRevenueMap.entries())
      .map(([category, revenue]) => ({
        category,
        revenue: Math.round(revenue * 100) / 100,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json({
      success: true,
      data: {
        revenueByDay,
        ordersByStatus,
        topProducts,
        revenueByCategory,
      },
    });
  } catch (error) {
    console.error("Admin analytics GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
