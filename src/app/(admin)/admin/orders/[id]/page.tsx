"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Package,
  Loader2,
  Truck,
} from "lucide-react";
import { formatPrice, formatDate, formatOrderNumber, cn } from "@/lib/utils/format";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  productName: string;
  productImage: string | null;
  productSlug: string;
};

type ShippingAddress = {
  firstName: string;
  lastName: string;
  street: string;
  apartment?: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  phone?: string;
};

type OrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentIntentId: string | null;
  providerTxId: string | null;
  shippingAddress: ShippingAddress | null;
  billingAddress: ShippingAddress | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
  items: OrderItem[];
};

const ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  PROCESSING: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  SHIPPED: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  DELIVERED: "bg-green-500/20 text-green-300 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-300 border-red-500/30",
  REFUNDED: "bg-charcoal-500/20 text-charcoal-300 border-charcoal-500/30",
};

const paymentStatusColors: Record<string, string> = {
  PENDING: "text-yellow-400",
  COMPLETED: "text-green-400",
  FAILED: "text-red-400",
  REFUNDED: "text-charcoal-300",
};

const paymentMethodLabels: Record<string, string> = {
  CARD: "Credit/Debit Card",
  PAYPAL: "PayPal",
  MPESA: "M-Pesa",
  MTN_MOMO: "MTN Mobile Money",
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [error, setError] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      const json = await res.json();
      if (json.success) {
        setOrder(json.data);
        setSelectedStatus(json.data.status);
      } else {
        setError(json.error || "Failed to load order");
      }
    } catch (err) {
      console.error("Failed to fetch order:", err);
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async () => {
    if (!order || selectedStatus === order.status) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setOrder(json.data);
      } else {
        alert(json.error || "Failed to update status");
        setSelectedStatus(order.status);
      }
    } catch (err) {
      console.error("Failed to update order:", err);
      alert("Failed to update status");
      setSelectedStatus(order.status);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-charcoal-400 hover:text-charcoal-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-300">
          {error || "Order not found"}
        </div>
      </div>
    );
  }

  const shippingAddr = order.shippingAddress as ShippingAddress | null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 text-charcoal-400 hover:text-charcoal-100 hover:bg-charcoal-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl text-charcoal-100">
              Order {formatOrderNumber(order.orderNumber)}
            </h1>
            <p className="text-charcoal-400 text-sm mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border self-start",
            statusColors[order.status] || statusColors.PENDING
          )}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - left 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-charcoal-700 flex items-center gap-2">
              <Package className="w-4 h-4 text-charcoal-400" />
              <h2 className="font-heading text-lg text-charcoal-100">
                Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-charcoal-800">
              {order.items.map((item) => (
                <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-charcoal-800 overflow-hidden flex-shrink-0">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-charcoal-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal-100 truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-charcoal-400 mt-0.5">
                      Qty: {item.quantity} x {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-charcoal-200">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="px-5 py-4 border-t border-charcoal-700 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-400">Subtotal</span>
                <span className="text-charcoal-200">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-400">Tax</span>
                <span className="text-charcoal-200">
                  {formatPrice(order.tax)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-400">Shipping</span>
                <span className="text-charcoal-200">
                  {order.shipping === 0
                    ? "Free"
                    : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-charcoal-800">
                <span className="text-charcoal-100">Total</span>
                <span className="text-gold-400">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-4 h-4 text-charcoal-400" />
              <h2 className="font-heading text-lg text-charcoal-100">
                Update Status
              </h2>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-charcoal-950 border border-charcoal-700 rounded-lg text-sm text-charcoal-100 focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/20 transition-colors"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || selectedStatus === order.status}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-400 text-charcoal-950 rounded-lg text-sm font-semibold hover:bg-gold-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                Update
              </button>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5">
              <h2 className="font-heading text-lg text-charcoal-100 mb-2">
                Order Notes
              </h2>
              <p className="text-sm text-charcoal-300">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar - right column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-charcoal-400" />
              <h2 className="font-heading text-lg text-charcoal-100">
                Customer
              </h2>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-charcoal-200">
                {order.user.name || "Anonymous"}
              </p>
              <p className="text-sm text-charcoal-400">{order.user.email}</p>
              {order.user.phone && (
                <p className="text-sm text-charcoal-400">{order.user.phone}</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {shippingAddr && (
            <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-charcoal-400" />
                <h2 className="font-heading text-lg text-charcoal-100">
                  Shipping Address
                </h2>
              </div>
              <div className="text-sm text-charcoal-300 space-y-1">
                <p>
                  {shippingAddr.firstName} {shippingAddr.lastName}
                </p>
                <p>{shippingAddr.street}</p>
                {shippingAddr.apartment && <p>{shippingAddr.apartment}</p>}
                <p>
                  {shippingAddr.city}
                  {shippingAddr.state ? `, ${shippingAddr.state}` : ""}{" "}
                  {shippingAddr.zipCode}
                </p>
                <p>{shippingAddr.country}</p>
                {shippingAddr.phone && (
                  <p className="text-charcoal-400 pt-1">{shippingAddr.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-charcoal-400" />
              <h2 className="font-heading text-lg text-charcoal-100">
                Payment
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-400">Method</span>
                <span className="text-charcoal-200">
                  {paymentMethodLabels[order.paymentMethod] ||
                    order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-400">Status</span>
                <span
                  className={cn(
                    "font-medium",
                    paymentStatusColors[order.paymentStatus] || "text-charcoal-300"
                  )}
                >
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentIntentId && (
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Ref</span>
                  <span className="text-charcoal-300 font-mono text-xs truncate max-w-[140px]">
                    {order.paymentIntentId}
                  </span>
                </div>
              )}
              {order.providerTxId && (
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">TX ID</span>
                  <span className="text-charcoal-300 font-mono text-xs truncate max-w-[140px]">
                    {order.providerTxId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
