import type { Product, ProductImage, Category, Review, User } from "@prisma/client";

export type ProductWithDetails = Product & {
  images: ProductImage[];
  category: Category;
  reviews: Review[];
  _count?: {
    reviews: number;
  };
};

export type ProductWithImages = Product & {
  images: ProductImage[];
};

export type CartItemType = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
  stock: number;
};

export type OrderSummary = {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
};

export type SearchFilters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price-asc" | "price-desc" | "newest" | "popular" | "rating";
  query?: string;
  page?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type SafeUser = Omit<User, "hashedPassword">;
