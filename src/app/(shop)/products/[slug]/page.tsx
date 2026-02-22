import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, getDiscountPercentage, formatDate } from "@/lib/utils/format";
import ProductActions from "@/components/product/ProductActions";
import ProductGrid from "@/components/product/ProductGrid";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      reviews: {
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!product || !product.isActive) return null;

  const reviewCount = product._count.reviews;
  const avgRating =
    reviewCount > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: product.id },
    },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      reviews: { select: { rating: true } },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const relatedWithStats = relatedProducts.map((p) => {
    const count = p.reviews.length;
    const avg =
      count > 0 ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    return {
      ...p,
      avgRating: Math.round(avg * 10) / 10,
      reviewCount: count,
    };
  });

  return {
    ...product,
    avgRating: Math.round(avgRating * 10) / 10,
    reviewCount,
    relatedProducts: relatedWithStats,
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) {
    return { title: "Product Not Found | Luxora" };
  }
  return {
    title: `${product.name} | Luxora`,
    description: product.description.slice(0, 160),
  };
}

function RatingStars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${cls} ${
            i < Math.round(rating)
              ? "fill-gold-400 text-gold-400"
              : "fill-charcoal-700 text-charcoal-700"
          }`}
        />
      ))}
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const primaryImage =
    product.images.find((img) => img.isPrimary) || product.images[0];
  const thumbnails = product.images;
  const discount = product.compareAt
    ? getDiscountPercentage(product.price, Number(product.compareAt))
    : 0;

  return (
    <div className="min-h-screen bg-charcoal-950">
      {/* Breadcrumb */}
      <div className="border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-charcoal-400">
            <Link
              href="/products"
              className="hover:text-charcoal-200 transition-colors"
            >
              Products
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-charcoal-200 transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-charcoal-200 truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-charcoal-900 border border-charcoal-700">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt || product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-charcoal-500">
                  No Image Available
                </div>
              )}
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {thumbnails.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {thumbnails.map((image) => (
                  <div
                    key={image.id}
                    className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-colors ${
                      image.id === primaryImage?.id
                        ? "border-gold-400"
                        : "border-charcoal-700 hover:border-charcoal-500"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col gap-6">
            {/* Category */}
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-sm font-medium text-gold-400 uppercase tracking-wider hover:text-gold-300 transition-colors self-start"
            >
              {product.category.name}
            </Link>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-charcoal-100 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-3">
                <RatingStars rating={product.avgRating} />
                <span className="text-sm text-charcoal-300">
                  {product.avgRating.toFixed(1)}
                </span>
                <span className="text-sm text-charcoal-500">
                  ({product.reviewCount}{" "}
                  {product.reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-charcoal-100">
                {formatPrice(Number(product.price))}
              </span>
              {product.compareAt && Number(product.compareAt) > Number(product.price) && (
                <>
                  <span className="text-xl text-charcoal-500 line-through">
                    {formatPrice(Number(product.compareAt))}
                  </span>
                  <span className="text-sm font-semibold text-red-400">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Divider */}
            <hr className="border-charcoal-700" />

            {/* Description */}
            <div className="text-charcoal-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>

            {/* Divider */}
            <hr className="border-charcoal-700" />

            {/* Actions */}
            <ProductActions
              productId={product.id}
              productName={product.name}
              price={Number(product.price)}
              image={primaryImage?.url || ""}
              slug={product.slug}
              stock={product.stock}
            />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews.length > 0 && (
        <section className="border-t border-charcoal-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-heading font-bold text-charcoal-100 mb-8">
              Customer Reviews ({product.reviewCount})
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-charcoal-200">
                        {review.user.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-charcoal-500 mt-0.5">
                        {formatDate(review.createdAt.toISOString())}
                      </p>
                    </div>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>
                  {review.title && (
                    <h4 className="text-charcoal-100 font-semibold mb-2">
                      {review.title}
                    </h4>
                  )}
                  {review.comment && (
                    <p className="text-charcoal-300 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {product.relatedProducts.length > 0 && (
        <section className="border-t border-charcoal-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-heading font-bold text-charcoal-100 mb-8">
              You May Also Like
            </h2>
            <ProductGrid products={product.relatedProducts} />
          </div>
        </section>
      )}
    </div>
  );
}
