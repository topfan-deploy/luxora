"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  image: string;
  stock: number;
  isActive: boolean;
  averageRating: number;
  reviewCount: number;
}

interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: WishlistProduct;
}

interface UseWishlistReturn {
  items: WishlistItem[];
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

export function useWishlist(): UseWishlistReturn {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = status === "authenticated" && !!session?.user;

  // Fetch wishlist items on mount when authenticated
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/wishlist");
      if (!res.ok) {
        setItems([]);
        return;
      }
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (status !== "loading") {
      fetchWishlist();
    }
  }, [status, fetchWishlist]);

  // Toggle a product in/out of the wishlist
  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!isAuthenticated) return;

      setLoading(true);
      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });

        if (!res.ok) {
          throw new Error("Failed to toggle wishlist item");
        }

        const data = await res.json();

        if (data.action === "removed") {
          setItems((prev) => prev.filter((i) => i.productId !== productId));
        } else {
          // Re-fetch to get full product details for the newly added item
          await fetchWishlist();
        }
      } catch (error) {
        console.error("Failed to toggle wishlist:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchWishlist]
  );

  // Check if a product is in the wishlist
  const isInWishlist = useCallback(
    (productId: string): boolean => {
      return items.some((item) => item.productId === productId);
    },
    [items]
  );

  return { items, toggleWishlist, isInWishlist, loading };
}
