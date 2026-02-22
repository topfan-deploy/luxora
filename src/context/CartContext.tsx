"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import type { CartItemType } from "@/types";

interface CartContextValue {
  items: CartItemType[];
  addItem: (item: CartItemType) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "luxora-cart";

function getLocalCart(): CartItemType[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setLocalCart(items: CartItemType[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable -- silently ignore
  }
}

function clearLocalCart(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItemType[]>([]);
  const [initialized, setInitialized] = useState(false);
  const prevSessionRef = useRef<string | null>(null);

  const isAuthenticated = status === "authenticated" && !!session?.user;

  // Fetch cart from API for authenticated users
  const fetchDbCart = useCallback(async (): Promise<CartItemType[]> => {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) return [];
      const data = await res.json();
      return data.items ?? [];
    } catch {
      return [];
    }
  }, []);

  // Merge local cart into DB cart on login
  const mergeCartsOnLogin = useCallback(async () => {
    const localItems = getLocalCart();

    // Add each local item to DB cart
    for (const item of localItems) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
          }),
        });
      } catch {
        // Continue merging remaining items
      }
    }

    // Clear localStorage after merge
    clearLocalCart();

    // Fetch the merged cart from DB
    return fetchDbCart();
  }, [fetchDbCart]);

  // Initialize cart
  useEffect(() => {
    async function init() {
      if (status === "loading") return;

      if (isAuthenticated) {
        const dbItems = await fetchDbCart();
        setItems(dbItems);
      } else {
        setItems(getLocalCart());
      }
      setInitialized(true);
    }

    init();
  }, [status, isAuthenticated, fetchDbCart]);

  // Detect login transition and merge carts
  useEffect(() => {
    if (status === "loading" || !initialized) return;

    const currentUserId = session?.user?.id ?? session?.user?.email ?? null;
    const previousUserId = prevSessionRef.current;

    // User just logged in (previous was null, now has a user)
    if (previousUserId === null && currentUserId !== null && initialized) {
      const localItems = getLocalCart();
      if (localItems.length > 0) {
        mergeCartsOnLogin().then((mergedItems) => {
          setItems(mergedItems);
        });
      }
    }

    prevSessionRef.current = currentUserId;
  }, [session, status, initialized, mergeCartsOnLogin]);

  // Add item
  const addItem = useCallback(
    async (item: CartItemType) => {
      if (isAuthenticated) {
        try {
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: item.productId,
              quantity: item.quantity,
            }),
          });

          if (!res.ok) throw new Error("Failed to add item");

          const dbItems = await fetchDbCart();
          setItems(dbItems);
        } catch (error) {
          console.error("Failed to add item to cart:", error);
          throw error;
        }
      } else {
        setItems((prev) => {
          const existingIndex = prev.findIndex(
            (i) => i.productId === item.productId
          );

          let updated: CartItemType[];

          if (existingIndex > -1) {
            updated = prev.map((i, idx) =>
              idx === existingIndex
                ? {
                    ...i,
                    quantity: Math.min(
                      i.quantity + item.quantity,
                      item.stock
                    ),
                  }
                : i
            );
          } else {
            updated = [...prev, { ...item, id: item.productId }];
          }

          setLocalCart(updated);
          return updated;
        });
      }
    },
    [isAuthenticated, fetchDbCart]
  );

  // Remove item
  const removeItem = useCallback(
    async (itemId: string) => {
      if (isAuthenticated) {
        try {
          const res = await fetch(`/api/cart/${itemId}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error("Failed to remove item");

          setItems((prev) => prev.filter((i) => i.id !== itemId));
        } catch (error) {
          console.error("Failed to remove item from cart:", error);
          throw error;
        }
      } else {
        setItems((prev) => {
          const updated = prev.filter((i) => i.id !== itemId);
          setLocalCart(updated);
          return updated;
        });
      }
    },
    [isAuthenticated]
  );

  // Update quantity
  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity < 1) {
        return removeItem(itemId);
      }

      if (isAuthenticated) {
        try {
          const res = await fetch(`/api/cart/${itemId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to update quantity");
          }

          setItems((prev) =>
            prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
          );
        } catch (error) {
          console.error("Failed to update cart item quantity:", error);
          throw error;
        }
      } else {
        setItems((prev) => {
          const updated = prev.map((i) => {
            if (i.id !== itemId) return i;
            const clampedQty = Math.min(quantity, i.stock);
            return { ...i, quantity: clampedQty };
          });
          setLocalCart(updated);
          return updated;
        });
      }
    },
    [isAuthenticated, removeItem]
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      // Remove all items one by one
      try {
        await Promise.all(
          items.map((item) =>
            fetch(`/api/cart/${item.id}`, { method: "DELETE" })
          )
        );
        setItems([]);
      } catch (error) {
        console.error("Failed to clear cart:", error);
        throw error;
      }
    } else {
      setItems([]);
      clearLocalCart();
    }
  }, [isAuthenticated, items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
