"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/format";

const ESTIMATED_TAX_RATE = 0.08;
const ESTIMATED_SHIPPING = 9.99;
const FREE_SHIPPING_THRESHOLD = 150;

export default function CartPage() {
  const { items, removeItem, updateQuantity, itemCount, subtotal } = useCart();

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0
      ? 0
      : ESTIMATED_SHIPPING;
  const tax = subtotal * ESTIMATED_TAX_RATE;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20">
          <ShoppingBag className="mb-6 h-20 w-20 text-charcoal-700" />
          <h1 className="mb-3 text-2xl font-bold text-charcoal-100">
            Your cart is empty
          </h1>
          <p className="mb-8 max-w-md text-center text-charcoal-400">
            Looks like you haven&apos;t added anything to your cart yet. Explore
            our collection to find something you love.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-gold-400 px-8 py-3 text-sm font-semibold text-charcoal-950 transition-colors hover:bg-gold-400/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal-100">Shopping Cart</h1>
        <p className="mt-1 text-sm text-charcoal-400">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Cart items */}
        <div className="lg:col-span-8">
          {/* Table header (desktop) */}
          <div className="hidden border-b border-charcoal-700 pb-3 sm:grid sm:grid-cols-12 sm:gap-4">
            <span className="col-span-6 text-xs font-medium uppercase tracking-wider text-charcoal-400">
              Product
            </span>
            <span className="col-span-2 text-center text-xs font-medium uppercase tracking-wider text-charcoal-400">
              Price
            </span>
            <span className="col-span-2 text-center text-xs font-medium uppercase tracking-wider text-charcoal-400">
              Quantity
            </span>
            <span className="col-span-2 text-right text-xs font-medium uppercase tracking-wider text-charcoal-400">
              Total
            </span>
          </div>

          {/* Cart item list */}
          <ul className="divide-y divide-charcoal-700/50">
            {items.map((item) => (
              <li
                key={item.id}
                className="py-6 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4"
              >
                {/* Product info */}
                <div className="flex gap-4 sm:col-span-6">
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-charcoal-700 bg-charcoal-900"
                  >
                    <Image
                      src={item.image || "/images/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </Link>
                  <div className="flex flex-col justify-center">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-medium text-charcoal-100 transition-colors hover:text-gold-400"
                    >
                      {item.name}
                    </Link>
                    {item.stock <= 5 && item.stock > 0 && (
                      <span className="mt-1 text-xs text-amber-400">
                        Only {item.stock} left in stock
                      </span>
                    )}
                    {/* Mobile price */}
                    <span className="mt-1 text-sm text-charcoal-300 sm:hidden">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>

                {/* Unit price (desktop) */}
                <div className="hidden text-center sm:col-span-2 sm:block">
                  <span className="text-sm text-charcoal-200">
                    {formatPrice(item.price)}
                  </span>
                </div>

                {/* Quantity controls */}
                <div className="mt-4 flex items-center justify-between sm:col-span-2 sm:mt-0 sm:justify-center">
                  <div className="flex items-center rounded-lg border border-charcoal-700 bg-charcoal-900">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="px-3 py-2 text-charcoal-300 transition-colors hover:text-charcoal-100 disabled:cursor-not-allowed disabled:text-charcoal-600"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[2.5rem] border-x border-charcoal-700 px-2 py-2 text-center text-sm font-medium text-charcoal-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.stock}
                      className="px-3 py-2 text-charcoal-300 transition-colors hover:text-charcoal-100 disabled:cursor-not-allowed disabled:text-charcoal-600"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Remove button (mobile) */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded p-2 text-charcoal-400 transition-colors hover:text-red-400 sm:hidden"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Line total + remove (desktop) */}
                <div className="hidden sm:col-span-2 sm:flex sm:items-center sm:justify-end sm:gap-3">
                  <span className="text-sm font-semibold text-charcoal-100">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded p-1.5 text-charcoal-400 transition-colors hover:bg-charcoal-900 hover:text-red-400"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Mobile line total */}
                <div className="mt-3 flex justify-end sm:hidden">
                  <span className="text-sm font-semibold text-charcoal-100">
                    Line total: {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* Continue shopping link */}
          <div className="mt-6 border-t border-charcoal-700 pt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-charcoal-300 transition-colors hover:text-gold-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="mt-10 lg:col-span-4 lg:mt-0">
          <div className="sticky top-24 rounded-xl border border-charcoal-700 bg-charcoal-900 p-6">
            <h2 className="text-lg font-semibold text-charcoal-100">
              Order Summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-charcoal-300">Subtotal</dt>
                <dd className="text-sm font-medium text-charcoal-200">
                  {formatPrice(subtotal)}
                </dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-sm text-charcoal-300">
                  Estimated Shipping
                </dt>
                <dd className="text-sm font-medium text-charcoal-200">
                  {shipping === 0 ? (
                    <span className="text-green-400">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </dd>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-charcoal-400">
                  Free shipping on orders over{" "}
                  {formatPrice(FREE_SHIPPING_THRESHOLD)}
                </p>
              )}

              <div className="flex items-center justify-between">
                <dt className="text-sm text-charcoal-300">Estimated Tax</dt>
                <dd className="text-sm font-medium text-charcoal-200">
                  {formatPrice(tax)}
                </dd>
              </div>

              <div className="flex items-center justify-between border-t border-charcoal-700 pt-4">
                <dt className="text-base font-semibold text-charcoal-100">
                  Total
                </dt>
                <dd className="text-base font-semibold text-charcoal-100">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/checkout"
                className="block rounded-lg bg-gold-400 py-3 text-center text-sm font-semibold text-charcoal-950 transition-colors hover:bg-gold-400/90"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/products"
                className="block rounded-lg border border-charcoal-700 py-3 text-center text-sm font-semibold text-charcoal-300 transition-colors hover:border-charcoal-600 hover:text-charcoal-100"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
