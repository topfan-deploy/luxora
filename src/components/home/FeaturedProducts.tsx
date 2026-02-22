import Link from "next/link";
import { ArrowRight, Star, ShoppingBag } from "lucide-react";
import { formatPrice, getDiscountPercentage } from "@/lib/utils/format";

type FeaturedProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  stock: number;
  images: {
    url: string;
    alt: string | null;
    isPrimary: boolean;
  }[];
  category: {
    name: string;
    slug: string;
  };
  avgRating: number;
  reviewCount: number;
};

type FeaturedProductsProps = {
  products: FeaturedProduct[];
};

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-charcoal-900/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal-100">
              Trending <span className="gold-text">Now</span>
            </h2>
            <p className="mt-2 text-charcoal-400">
              Our most popular picks, handpicked for you.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => {
            const primaryImage =
              product.images.find((img) => img.isPrimary) || product.images[0];
            const discount = product.compareAt
              ? getDiscountPercentage(product.price, product.compareAt)
              : 0;

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group"
              >
                <div className="card flex flex-col h-full">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-charcoal-800">
                    {primaryImage ? (
                      <img
                        src={primaryImage.url}
                        alt={primaryImage.alt || product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="h-12 w-12 text-charcoal-600" />
                      </div>
                    )}

                    {/* Sale Badge */}
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                        -{discount}%
                      </span>
                    )}

                    {/* Out of Stock */}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-charcoal-950/70 flex items-center justify-center">
                        <span className="text-charcoal-200 font-semibold text-sm tracking-wide uppercase">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-4 gap-2">
                    {/* Category */}
                    <span className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                      {product.category.name}
                    </span>

                    {/* Name */}
                    <h3 className="text-charcoal-100 font-heading font-semibold text-sm leading-snug line-clamp-2 group-hover:text-gold-400 transition-colors duration-200">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    {product.reviewCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < Math.round(product.avgRating)
                                  ? "fill-gold-400 text-gold-400"
                                  : "fill-charcoal-700 text-charcoal-700"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-charcoal-400">
                          ({product.reviewCount})
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-auto pt-2">
                      <span className="text-charcoal-100 font-semibold text-base">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAt &&
                        product.compareAt > product.price && (
                          <span className="text-charcoal-500 line-through text-sm">
                            {formatPrice(product.compareAt)}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
