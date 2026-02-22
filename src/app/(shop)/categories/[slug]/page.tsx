import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import ProductGrid from "@/components/product/ProductGrid";

export const dynamic = "force-dynamic";

async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
  });

  if (!category) return null;

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    productCount: category._count.products,
  };
}

async function getCategoryProducts(slug: string, page = "1") {
  const pageNum = Math.max(1, parseInt(page, 10));
  const limit = 12;
  const skip = (pageNum - 1) * limit;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    category: { slug },
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { position: "asc" } },
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
    pagination: {
      page: pageNum,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    return { title: "Category Not Found | Luxora" };
  }
  return {
    title: `${category.name} | Luxora`,
    description:
      category.description ||
      `Browse our ${category.name} collection at Luxora.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const [category, productsResponse] = await Promise.all([
    getCategoryBySlug(params.slug),
    getCategoryProducts(params.slug, searchParams.page),
  ]);

  if (!category) {
    notFound();
  }

  const { data: products, pagination } = productsResponse;
  const currentPage = pagination.page;
  const totalPages = pagination.totalPages;

  return (
    <div className="min-h-screen bg-charcoal-950">
      {/* Category Header */}
      <div className="border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-charcoal-400 mb-6">
            <Link
              href="/products"
              className="hover:text-charcoal-200 transition-colors"
            >
              Products
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-charcoal-200">{category.name}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-heading font-bold text-charcoal-100">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 text-charcoal-400 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          )}
          <p className="mt-2 text-sm text-charcoal-500">
            {category.productCount}{" "}
            {category.productCount === 1 ? "product" : "products"}
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <ProductGrid
          products={products}
          emptyMessage={`No products found in ${category.name}`}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="flex items-center justify-center gap-2 mt-12"
            aria-label="Category pagination"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Link
                  key={page}
                  href={`/categories/${params.slug}?page=${page}`}
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
          </nav>
        )}
      </div>
    </div>
  );
}
