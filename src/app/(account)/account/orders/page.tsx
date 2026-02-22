import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, formatOrderNumber } from "@/lib/utils/format";
import {
  ArrowRight,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";

const statusConfig: Record<
  string,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: React.ElementType;
  }
> = {
  PENDING: {
    label: "Pending",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30",
    icon: Clock,
  },
  PROCESSING: {
    label: "Processing",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
    icon: Loader2,
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/30",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/30",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/30",
    icon: XCircle,
  },
  REFUNDED: {
    label: "Refunded",
    color: "text-charcoal-400",
    bgColor: "bg-charcoal-400/10",
    borderColor: "border-charcoal-400/30",
    icon: RotateCcw,
  },
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/account/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl text-charcoal-100">
          Order History
        </h1>
        <p className="text-charcoal-400 font-body mt-1">
          Track and manage your orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl flex flex-col items-center justify-center py-20 px-6 text-center">
          <ShoppingBag className="h-16 w-16 text-charcoal-600 mb-6" />
          <h2 className="text-charcoal-200 font-heading text-xl mb-2">
            No orders yet
          </h2>
          <p className="text-charcoal-400 font-body text-sm mb-8 max-w-sm">
            When you place an order, it will appear here. Start exploring our
            collection to find something you love.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-400 text-charcoal-950 font-body font-semibold rounded-lg hover:bg-gold-300 transition-colors text-sm"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.PENDING;
            const StatusIcon = config.icon;
            const itemCount = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block bg-charcoal-900 border border-charcoal-700 rounded-xl hover:border-charcoal-600 transition-colors group"
              >
                <div className="p-5 sm:p-6">
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg ${config.bgColor} border ${config.borderColor} flex items-center justify-center flex-shrink-0`}
                      >
                        <StatusIcon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div>
                        <h3 className="text-charcoal-100 font-heading text-base font-semibold">
                          Order {formatOrderNumber(order.orderNumber)}
                        </h3>
                        <p className="text-charcoal-400 font-body text-sm">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${config.bgColor} ${config.borderColor} ${config.color}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  {/* Details Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-charcoal-700/50">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-charcoal-400 font-body text-xs uppercase tracking-wider">
                          Total
                        </p>
                        <p className="text-charcoal-100 font-body text-sm font-semibold mt-0.5">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                      <div>
                        <p className="text-charcoal-400 font-body text-xs uppercase tracking-wider">
                          Items
                        </p>
                        <p className="text-charcoal-100 font-body text-sm font-semibold mt-0.5">
                          {itemCount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-charcoal-400 group-hover:text-gold-400 transition-colors">
                      <span className="text-sm font-body hidden sm:inline">
                        View Details
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
