import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, formatOrderNumber } from "@/lib/utils/format";
import {
  ArrowLeft,
  Clock,
  Loader2,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  CreditCard,
  MapPin,
  Package,
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

const paymentMethodLabels: Record<string, string> = {
  CARD: "Credit / Debit Card",
  PAYPAL: "PayPal",
  MPESA: "M-Pesa",
  MTN_MOMO: "MTN Mobile Money",
};

const paymentStatusConfig: Record<
  string,
  { label: string; color: string }
> = {
  PENDING: { label: "Pending", color: "text-yellow-400" },
  COMPLETED: { label: "Completed", color: "text-green-400" },
  FAILED: { label: "Failed", color: "text-red-400" },
  REFUNDED: { label: "Refunded", color: "text-charcoal-400" },
};

type ShippingAddress = {
  firstName?: string;
  lastName?: string;
  street?: string;
  apartment?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
};

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/account/orders");
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  const config = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;
  const paymentLabel =
    paymentMethodLabels[order.paymentMethod] || order.paymentMethod;
  const paymentStatusCfg =
    paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.PENDING;
  const shippingAddress = order.shippingAddress as ShippingAddress | null;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-charcoal-400 hover:text-gold-400 transition-colors font-body text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl text-charcoal-100">
              Order {formatOrderNumber(order.orderNumber)}
            </h1>
            <p className="text-charcoal-400 font-body text-sm mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full border ${config.bgColor} ${config.borderColor} ${config.color}`}
          >
            <StatusIcon className="h-4 w-4" />
            {config.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items List - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-charcoal-700">
              <h2 className="font-heading text-lg text-charcoal-100">
                Order Items
              </h2>
            </div>
            <div className="divide-y divide-charcoal-700/50">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-5"
                >
                  {/* Product Image */}
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-charcoal-800 border border-charcoal-700 overflow-hidden flex-shrink-0">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-charcoal-600" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="text-charcoal-100 font-body text-sm font-medium hover:text-gold-400 transition-colors"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-charcoal-400 font-body text-sm mt-0.5">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-charcoal-100 font-body text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-charcoal-400 font-body text-xs">
                        {formatPrice(item.price)} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Order Summary, Shipping, Payment */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6">
            <h2 className="font-heading text-lg text-charcoal-100 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between font-body text-sm">
                <span className="text-charcoal-400">Subtotal</span>
                <span className="text-charcoal-200">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-charcoal-400">Shipping</span>
                <span className="text-charcoal-200">
                  {order.shipping === 0
                    ? "Free"
                    : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-charcoal-400">Tax</span>
                <span className="text-charcoal-200">
                  {formatPrice(order.tax)}
                </span>
              </div>
              <div className="border-t border-charcoal-700 pt-3 flex justify-between">
                <span className="text-charcoal-100 font-heading font-semibold">
                  Total
                </span>
                <span className="text-charcoal-100 font-heading font-bold text-lg">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-gold-400" />
              <h2 className="font-heading text-lg text-charcoal-100">
                Payment
              </h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between font-body text-sm">
                <span className="text-charcoal-400">Method</span>
                <span className="text-charcoal-200">{paymentLabel}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-charcoal-400">Status</span>
                <span className={`font-semibold ${paymentStatusCfg.color}`}>
                  {paymentStatusCfg.label}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {shippingAddress && (
            <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-gold-400" />
                <h2 className="font-heading text-lg text-charcoal-100">
                  Shipping Address
                </h2>
              </div>
              <div className="font-body text-sm text-charcoal-300 space-y-1">
                <p className="text-charcoal-100 font-medium">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </p>
                <p>{shippingAddress.street}</p>
                {shippingAddress.apartment && (
                  <p>{shippingAddress.apartment}</p>
                )}
                <p>
                  {shippingAddress.city}
                  {shippingAddress.state && `, ${shippingAddress.state}`}{" "}
                  {shippingAddress.zipCode}
                </p>
                <p>{shippingAddress.country}</p>
                {shippingAddress.phone && (
                  <p className="text-charcoal-400 mt-2">
                    {shippingAddress.phone}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
