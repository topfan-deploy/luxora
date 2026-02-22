"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/format";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, itemCount, subtotal } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-charcoal-950 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-charcoal-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-charcoal-100">
            Shopping Cart
            {itemCount > 0 && (
              <span className="ml-2 text-sm font-normal text-charcoal-400">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-charcoal-400 transition-colors hover:bg-charcoal-900 hover:text-charcoal-100"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart items */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <ShoppingBag className="mb-4 h-16 w-16 text-charcoal-700" />
            <p className="mb-2 text-lg font-medium text-charcoal-200">
              Your cart is empty
            </p>
            <p className="mb-6 text-center text-sm text-charcoal-400">
              Discover our curated collection and add something extraordinary.
            </p>
            <button
              onClick={onClose}
              className="rounded-lg bg-gold-400 px-6 py-2.5 text-sm font-semibold text-charcoal-950 transition-colors hover:bg-gold-400/90"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-lg border border-charcoal-700 bg-charcoal-900 p-3"
                  >
                    {/* Product image */}
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={onClose}
                      className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-charcoal-800"
                    >
                      <Image
                        src={item.image || "/images/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </Link>

                    {/* Item details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={onClose}
                          className="truncate text-sm font-medium text-charcoal-100 transition-colors hover:text-gold-400"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 rounded p-1 text-charcoal-400 transition-colors hover:bg-charcoal-800 hover:text-red-400"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="rounded p-1 text-charcoal-300 transition-colors hover:bg-charcoal-800 hover:text-charcoal-100 disabled:cursor-not-allowed disabled:text-charcoal-600"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-[2rem] text-center text-sm font-medium text-charcoal-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                            className="rounded p-1 text-charcoal-300 transition-colors hover:bg-charcoal-800 hover:text-charcoal-100 disabled:cursor-not-allowed disabled:text-charcoal-600"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-semibold text-gold-400">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer with subtotal and buttons */}
            <div className="border-t border-charcoal-700 px-6 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-charcoal-300">Subtotal</span>
                <span className="text-lg font-semibold text-charcoal-100">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mb-4 text-xs text-charcoal-400">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block rounded-lg bg-gold-400 py-3 text-center text-sm font-semibold text-charcoal-950 transition-colors hover:bg-gold-400/90"
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="block rounded-lg border border-gold-400 py-3 text-center text-sm font-semibold text-gold-400 transition-colors hover:bg-gold-400/10"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
