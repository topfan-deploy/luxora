import { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/product/ProductGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search | Luxora",
  description: "Search our luxury product collection.",
};

type SearchParams = {
  q?: string;
  page?: string;
};

async function searchProducts(query: string, page = "1") {
  const pageNum = Math.max(1, parseInt(page, 10));
  const limit = 12;
  const skip = (pageNum - 1) * limit;

  const where = {
    isActive: true as const,
    OR: [
      { name: { contains: query, mode: "insensitive" as const } },
      { description: { contains: query, mode: "insensitive" as const } },
    ],
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { position: "asc" as const } },
        category: true,
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
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
    pagination: { page: pageNum, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = searchParams.q || "";
  const hasQuery = query.trim().length > 0;

  let products: Awaited<ReturnType<typeof searchProducts>>["data"] = [];
  let total = 0;

  if (hasQuery) {
    const response = await searchProducts(query, searchParams.page);
    products = response.data;
    total = response.pagination.total;
  }

  return (
    <div className="min-h-screen bg-charcoal-950">
      {/* Header */}
      <div className="border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-charcoal-100">
            {hasQuery ? `Search results for "${query}"` : "Search Products"}
          </h1>
          {hasQuery && (
            <p className="mt-2 text-charcoal-400">
              {total} {total === 1 ? "result" : "results"} found
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {!hasQuery ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-16 w-16 text-charcoal-600 mb-4" />
            <h2 className="text-xl font-heading font-semibold text-charcoal-200 mb-2">
              Start searching
            </h2>
            <p className="text-charcoal-400 max-w-md">
              Type a keyword in the search bar to find products from our collection.
            </p>
          </div>
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-16 w-16 text-charcoal-600 mb-4" />
            <h2 className="text-xl font-heading font-semibold text-charcoal-200 mb-2">
              No results found
            </h2>
            <p className="text-charcoal-400 max-w-md mb-8">
              We could not find any products matching &quot;{query}&quot;. Try
              different keywords or browse our categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <h3 className="text-sm font-medium text-charcoal-300 uppercase tracking-wider">
                Suggestions
              </h3>
            </div>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-charcoal-400">
              <li>Check your spelling and try again</li>
              <li>Use more general keywords</li>
              <li>Try searching for a product category</li>
            </ul>
            <Link
              href="/products"
              className="mt-8 btn-primary inline-flex items-center"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
