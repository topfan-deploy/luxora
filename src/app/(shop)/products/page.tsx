import { Metadata } from "next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All Products | Luxora",
  description:
    "Browse our curated collection of premium products. Find luxury items across all categories.",
};

type SearchParams = {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  query?: string;
  page?: string;
};

async function getProducts(searchParams: SearchParams) {
  try {
    const page = Math.max(1, parseInt(searchParams.page || "1", 10));
    const limit = 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (searchParams.category) {
      where.category = { slug: searchParams.category };
    }

    if (searchParams.minPrice || searchParams.maxPrice) {
      where.price = {};
      if (searchParams.minPrice) {
        where.price.gte = parseFloat(searchParams.minPrice);
      }
      if (searchParams.maxPrice) {
        where.price.lte = parseFloat(searchParams.maxPrice);
      }
    }

    if (searchParams.query) {
      where.OR = [
        { name: { contains: searchParams.query, mode: "insensitive" } },
        { description: { contains: searchParams.query, mode: "insensitive" } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput;
    switch (searchParams.sortBy) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "popular":
        orderBy = { orderItems: { _count: "desc" } };
        break;
      case "rating":
        orderBy = { reviews: { _count: "desc" } };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { position: "asc" } },
          category: true,
          reviews: { select: { rating: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithStats = products.map((product) => {
      const reviewCount = product.reviews.length;
      const avgRating =
        reviewCount > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
          : 0;

      return {
        ...product,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount,
      };
    });

    return {
      data: productsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch {
    return {
      data: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    };
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: { where: { isActive: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      productCount: category._count.products,
    }));
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [productsResponse, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);

  const { data: products, pagination } = productsResponse;
  const currentPage = pagination.page;
  const totalPages = pagination.totalPages;

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice);
    if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice);
    if (searchParams.sortBy) params.set("sortBy", searchParams.sortBy);
    if (searchParams.query) params.set("query", searchParams.query);
    params.set("page", String(page));
    return `/products?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-charcoal-950">
      {/* Page Header */}
      <div className="border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-charcoal-100">
            {searchParams.query
              ? `Results for "${searchParams.query}"`
              : "All Products"}
          </h1>
          <p className="mt-2 text-charcoal-400">
            {pagination.total} {pagination.total === 1 ? "product" : "products"} found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <ProductFilters categories={categories} />

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={products} />

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="flex items-center justify-center gap-1 mt-12"
                aria-label="Products pagination"
              >
                {/* Previous */}
                {currentPage > 1 ? (
                  <Link
                    href={buildPageUrl(currentPage - 1)}
                    className="p-2.5 rounded-lg border border-charcoal-700 text-charcoal-300 hover:bg-charcoal-800 hover:text-charcoal-100 transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="p-2.5 rounded-lg border border-charcoal-800 text-charcoal-600 cursor-not-allowed">
                    <ChevronLeft className="h-4 w-4" />
                  </span>
                )}

                {/* Page Numbers */}
                {getPageNumbers().map((page, idx) =>
                  page === "ellipsis" ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-3 py-2 text-charcoal-500"
                    >
                      ...
                    </span>
                  ) : (
                    <Link
                      key={page}
                      href={buildPageUrl(page)}
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage
                          ? "bg-gold-400 text-charcoal-950"
                          : "border border-charcoal-700 text-charcoal-300 hover:bg-charcoal-800 hover:text-charcoal-100"
                      }`}
                      aria-current={page === currentPage ? "page" : undefined}
                    >
                      {page}
                    </Link>
                  )
                )}

                {/* Next */}
                {currentPage < totalPages ? (
                  <Link
                    href={buildPageUrl(currentPage + 1)}
                    className="p-2.5 rounded-lg border border-charcoal-700 text-charcoal-300 hover:bg-charcoal-800 hover:text-charcoal-100 transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="p-2.5 rounded-lg border border-charcoal-800 text-charcoal-600 cursor-not-allowed">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
