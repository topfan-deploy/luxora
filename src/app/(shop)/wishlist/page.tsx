"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
  LogIn,
} from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/format";

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const { items, toggleWishlist, loading } = useWishlist();
  const { addItem } = useCart();

  const isAuthenticated = status === "authenticated" && !!session?.user;

  // Login prompt for unauthenticated users
  if (status !== "loading" && !isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20">
          <LogIn className="mb-6 h-16 w-16 text-charcoal-700" />
          <h1 className="mb-3 text-2xl font-bold text-charcoal-100">
            Sign in to view your wishlist
          </h1>
          <p className="mb-8 max-w-md text-center text-charcoal-400">
            Save your favorite items and come back to them anytime. Sign in to
            get started.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 rounded-lg bg-gold-400 px-8 py-3 text-sm font-semibold text-charcoal-950 transition-colors hover:bg-gold-400/90"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (status === "loading" || (loading && items.length === 0)) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-charcoal-100">
          My Wishlist
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-charcoal-700 bg-charcoal-900"
            >
              <div className="aspect-square bg-charcoal-800 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 rounded bg-charcoal-800" />
                <div className="h-4 w-1/2 rounded bg-charcoal-800" />
                <div className="h-8 rounded bg-charcoal-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty wishlist state
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20">
          <Heart className="mb-6 h-20 w-20 text-charcoal-700" />
          <h1 className="mb-3 text-2xl font-bold text-charcoal-100">
            Your wishlist is empty
          </h1>
          <p className="mb-8 max-w-md text-center text-charcoal-400">
            Start adding items you love by clicking the heart icon on any
            product. Your favorites will be saved here.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-gold-400 px-8 py-3 text-sm font-semibold text-charcoal-950 transition-colors hover:bg-gold-400/90"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  async function handleMoveToCart(item: (typeof items)[0]) {
    try {
      await addItem({
        id: item.productId,
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        slug: item.product.slug,
        quantity: 1,
        stock: item.product.stock,
      });

      // Remove from wishlist after adding to cart
      await toggleWishlist(item.productId);
    } catch (error) {
      console.error("Failed to move item to cart:", error);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal-100">My Wishlist</h1>
        <p className="mt-1 text-sm text-charcoal-400">
          {items.length} {items.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-xl border border-charcoal-700 bg-charcoal-900 transition-colors hover:border-charcoal-600"
          >
            {/* Product image */}
            <Link
              href={`/products/${item.product.slug}`}
              className="relative block aspect-square overflow-hidden bg-charcoal-800"
            >
              <Image
                src={item.product.image || "/images/placeholder.png"}
                alt={item.product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Discount badge */}
              {item.product.compareAt && item.product.compareAt > item.product.price && (
                <span className="absolute left-3 top-3 rounded-md bg-red-500/90 px-2 py-1 text-xs font-semibold text-white">
                  -
                  {Math.round(
                    ((item.product.compareAt - item.product.price) /
                      item.product.compareAt) *
                      100
                  )}
                  %
                </span>
              )}

              {/* Out of stock overlay */}
              {item.product.stock === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="rounded-md bg-charcoal-950/80 px-4 py-2 text-sm font-medium text-charcoal-200">
                    Out of Stock
                  </span>
                </div>
              )}
            </Link>

            {/* Remove from wishlist button */}
            <button
              onClick={() => toggleWishlist(item.productId)}
              disabled={loading}
              className="absolute right-3 top-3 rounded-full bg-charcoal-950/70 p-2 text-red-400 backdrop-blur-sm transition-colors hover:bg-charcoal-950/90 hover:text-red-300 disabled:opacity-50"
              aria-label={`Remove ${item.product.name} from wishlist`}
            >
              <Heart className="h-4 w-4 fill-current" />
            </button>

            {/* Product details */}
            <div className="p-4">
              <Link
                href={`/products/${item.product.slug}`}
                className="mb-1 block truncate text-sm font-medium text-charcoal-100 transition-colors hover:text-gold-400"
              >
                {item.product.name}
              </Link>

              {/* Rating */}
              {item.product.reviewCount > 0 && (
                <div className="mb-2 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                  <span className="text-xs text-charcoal-300">
                    {item.product.averageRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-charcoal-400">
                    ({item.product.reviewCount})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-4 flex items-center gap-2">
                <span className="text-lg font-semibold text-charcoal-100">
                  {formatPrice(item.product.price)}
                </span>
                {item.product.compareAt && item.product.compareAt > item.product.price && (
                  <span className="text-sm text-charcoal-400 line-through">
                    {formatPrice(item.product.compareAt)}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleMoveToCart(item)}
                  disabled={item.product.stock === 0 || loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gold-400 py-2.5 text-sm font-semibold text-charcoal-950 transition-colors hover:bg-gold-400/90 disabled:cursor-not-allowed disabled:bg-charcoal-700 disabled:text-charcoal-400"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Move to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(item.productId)}
                  disabled={loading}
                  className="flex items-center justify-center rounded-lg border border-charcoal-700 px-3 py-2.5 text-charcoal-400 transition-colors hover:border-red-400/50 hover:text-red-400 disabled:opacity-50"
                  aria-label={`Remove ${item.product.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
