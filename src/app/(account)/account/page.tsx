import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils/format";
import {
  Package,
  Heart,
  MapPin,
  ArrowRight,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";

const statusConfig: Record<
  string,
  { color: string; bgColor: string; icon: React.ElementType }
> = {
  PENDING: { color: "text-yellow-400", bgColor: "bg-yellow-400/10 border-yellow-400/30", icon: Clock },
  PROCESSING: { color: "text-blue-400", bgColor: "bg-blue-400/10 border-blue-400/30", icon: Package },
  SHIPPED: { color: "text-purple-400", bgColor: "bg-purple-400/10 border-purple-400/30", icon: Truck },
  DELIVERED: { color: "text-green-400", bgColor: "bg-green-400/10 border-green-400/30", icon: CheckCircle },
  CANCELLED: { color: "text-red-400", bgColor: "bg-red-400/10 border-red-400/30", icon: Package },
  REFUNDED: { color: "text-charcoal-400", bgColor: "bg-charcoal-400/10 border-charcoal-400/30", icon: Package },
};

export default async function AccountDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const userId = session.user.id;

  const [totalOrders, wishlistCount, addressCount, recentOrders] =
    await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.wishlistItem.count({ where: { userId } }),
      prisma.address.count({ where: { userId } }),
      prisma.order.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const firstName = session.user.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl text-charcoal-100">
          Welcome back, {firstName}
        </h1>
        <p className="text-charcoal-400 font-body mt-1">
          Manage your orders, addresses, and account settings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          icon={Package}
          label="Total Orders"
          value={totalOrders}
          href="/account/orders"
        />
        <StatsCard
          icon={Heart}
          label="Wishlist Items"
          value={wishlistCount}
          href="/account/wishlist"
        />
        <StatsCard
          icon={MapPin}
          label="Saved Addresses"
          value={addressCount}
          href="/account/addresses"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-700">
          <h2 className="font-heading text-lg text-charcoal-100">
            Recent Orders
          </h2>
          {totalOrders > 0 && (
            <Link
              href="/account/orders"
              className="text-sm text-gold-400 hover:text-gold-300 transition-colors font-body flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-charcoal-600 mb-4" />
            <p className="text-charcoal-300 font-heading text-lg mb-2">
              No orders yet
            </p>
            <p className="text-charcoal-400 font-body text-sm mb-6">
              Start shopping to see your orders here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-400 text-charcoal-950 font-body font-semibold rounded-lg hover:bg-gold-300 transition-colors text-sm"
            >
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-charcoal-700/50">
            {recentOrders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.PENDING;
              const StatusIcon = config.icon;
              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-charcoal-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`h-10 w-10 rounded-lg ${config.bgColor} border flex items-center justify-center flex-shrink-0`}
                    >
                      <StatusIcon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-charcoal-100 font-body text-sm font-medium">
                        #{order.orderNumber}
                      </p>
                      <p className="text-charcoal-400 font-body text-xs">
                        {formatDate(order.createdAt)} &middot;{" "}
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-charcoal-100 font-body text-sm font-medium">
                        {formatPrice(order.total)}
                      </p>
                      <span
                        className={`inline-block text-xs font-semibold ${config.color}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-charcoal-500 group-hover:text-gold-400 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuickLink
          href="/account/addresses"
          title="Manage Addresses"
          description="Add or edit your shipping addresses"
          icon={MapPin}
        />
        <QuickLink
          href="/account/settings"
          title="Account Settings"
          description="Update your profile and password"
          icon={Package}
        />
      </div>
    </div>
  );
}

function StatsCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5 hover:border-gold-400/30 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-lg bg-gold-400/10 border border-gold-400/20 flex items-center justify-center">
          <Icon className="h-5 w-5 text-gold-400" />
        </div>
        <div>
          <p className="text-2xl font-heading text-charcoal-100 font-bold">
            {value}
          </p>
          <p className="text-charcoal-400 font-body text-sm">{label}</p>
        </div>
      </div>
    </Link>
  );
}

function QuickLink({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 bg-charcoal-900 border border-charcoal-700 rounded-xl p-5 hover:border-gold-400/30 transition-colors group"
    >
      <div className="h-11 w-11 rounded-lg bg-charcoal-800 border border-charcoal-700 flex items-center justify-center group-hover:border-gold-400/30 transition-colors">
        <Icon className="h-5 w-5 text-charcoal-300 group-hover:text-gold-400 transition-colors" />
      </div>
      <div>
        <p className="text-charcoal-100 font-heading text-sm font-semibold group-hover:text-gold-400 transition-colors">
          {title}
        </p>
        <p className="text-charcoal-400 font-body text-xs">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-charcoal-500 group-hover:text-gold-400 transition-colors ml-auto" />
    </Link>
  );
}
