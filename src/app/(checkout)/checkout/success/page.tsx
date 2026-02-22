"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Package,
  ArrowRight,
  ShoppingBag,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils/format";

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    productName: string;
    productImage: string | null;
    productSlug: string;
  }[];
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const isPending = searchParams.get("pending") === "true";

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch {
        // Order fetch is optional
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const handleCopyOrderNumber = () => {
    const num = order?.orderNumber || orderNumber || "";
    if (num) {
      navigator.clipboard.writeText(num);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
          <span className="ml-3 text-charcoal-300 text-lg">
            Loading order details...
          </span>
        </div>
      </div>
    );
  }

  const displayOrderNumber = order?.orderNumber || orderNumber;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-10">
        <div className="mb-6">
          {isPending ? (
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/10 border-2 border-yellow-500/30">
              <Clock className="h-10 w-10 text-yellow-400" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30">
              <CheckCircle2 className="h-10 w-10 text-green-400" />
            </div>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal-100 mb-3">
          {isPending ? "Order Placed!" : "Order Confirmed!"}
        </h1>

        <p className="text-charcoal-300 text-lg max-w-md mx-auto">
          {isPending
            ? "Your order has been placed. We are waiting for your mobile money payment to be confirmed."
            : "Thank you for your purchase. Your order has been confirmed and is being processed."}
        </p>
      </div>

      {displayOrderNumber && (
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl p-6 mb-6 text-center">
          <p className="text-sm text-charcoal-400 mb-2 uppercase tracking-wider">
            Order Number
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl font-mono font-bold text-gold-400 tracking-wider">
              #{displayOrderNumber}
            </span>
            <button
              onClick={handleCopyOrderNumber}
              className="p-2 rounded-lg hover:bg-charcoal-800 text-charcoal-400 hover:text-charcoal-200 transition-colors"
              title="Copy order number"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {order && (
        <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-heading font-semibold text-charcoal-100 mb-4">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-14 h-14 bg-charcoal-800 rounded-lg overflow-hidden flex-shrink-0">
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-charcoal-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.productSlug}`}
                    className="text-sm text-charcoal-200 hover:text-gold-400 transition-colors truncate block"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-xs text-charcoal-400">
                    {formatPrice(item.price)} x {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-charcoal-100">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-charcoal-700 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-400">Subtotal</span>
              <span className="text-charcoal-200">
                {formatPrice(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-400">Shipping</span>
              <span className="text-charcoal-200">
                {order.shipping === 0 ? (
                  <span className="text-green-400">Free</span>
                ) : (
                  formatPrice(order.shipping)
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-400">Tax</span>
              <span className="text-charcoal-200">
                {formatPrice(order.tax)}
              </span>
            </div>
            <div className="border-t border-charcoal-700 pt-2 flex justify-between">
              <span className="font-semibold text-charcoal-100">Total</span>
              <span className="font-bold text-gold-400">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
                order.paymentStatus === "COMPLETED"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : order.paymentStatus === "PENDING"
                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
              )}
            >
              {order.paymentStatus === "COMPLETED" ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Clock className="h-3.5 w-3.5" />
              )}
              Payment: {order.paymentStatus}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-charcoal-800 text-charcoal-300 border border-charcoal-700">
              <Package className="h-3.5 w-3.5" />
              Order: {order.status}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <button
          onClick={() => router.push("/products")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-charcoal-700 text-charcoal-200 hover:text-charcoal-100 hover:border-charcoal-600 transition-colors"
        >
          <ShoppingBag className="h-5 w-5" />
          Continue Shopping
        </button>

        {orderId && (
          <Link
            href={`/account/orders/${orderId}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gold-400 text-charcoal-950 font-medium hover:bg-gold-300 transition-colors"
          >
            View Order
            <ArrowRight className="h-5 w-5" />
          </Link>
        )}
      </div>

      {isPending && (
        <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-center">
          <p className="text-sm text-yellow-300">
            Please check your phone and approve the payment request. Your order
            will be confirmed once payment is received. You can track the
            status on your orders page.
          </p>
        </div>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
            <span className="ml-3 text-charcoal-300 text-lg">
              Loading...
            </span>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
