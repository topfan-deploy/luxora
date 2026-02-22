"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { formatPrice, getDiscountPercentage } from "@/lib/utils/format";

type ProductForCard = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  stock?: number;
  images: { url: string; alt: string | null; isPrimary?: boolean }[];
  category: { name: string };
  avgRating?: number;
  reviewCount?: number;
};

type ProductCardProps = {
  product: ProductForCard;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const discount = product.compareAt
    ? getDiscountPercentage(product.price, product.compareAt)
    : 0;
  const stock = product.stock ?? 1;
  const avgRating = product.avgRating ?? 0;
  const reviewCount = product.reviewCount ?? 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${
          i < Math.round(rating)
            ? "fill-gold-400 text-gold-400"
            : "fill-charcoal-700 text-charcoal-700"
        }`}
      />
    ));
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div
        className="card group relative flex flex-col h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-charcoal-800">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-charcoal-500">
              No Image
            </div>
          )}

          {/* Sale Badge */}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md z-10">
              -{discount}%
            </span>
          )}

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-charcoal-950/60 flex items-center justify-center gap-3 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || stock === 0}
              className="bg-gold-400 text-charcoal-950 p-3 rounded-full hover:bg-gold-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add to cart"
            >
              <ShoppingCart className={`h-5 w-5 ${isAddingToCart ? "animate-pulse" : ""}`} />
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`p-3 rounded-full transition-colors duration-200 ${
                isWishlisted
                  ? "bg-red-500 text-white"
                  : "bg-charcoal-800 text-charcoal-200 hover:bg-charcoal-700"
              }`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {stock === 0 && (
            <div className="absolute inset-0 bg-charcoal-950/70 flex items-center justify-center z-10">
              <span className="text-charcoal-200 font-semibold text-sm tracking-wide uppercase">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          {/* Category Badge */}
          <span className="text-xs font-medium text-gold-400 uppercase tracking-wider">
            {product.category.name}
          </span>

          {/* Product Name */}
          <h3 className="text-charcoal-100 font-heading font-semibold text-sm leading-snug line-clamp-2 group-hover:text-gold-400 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">{renderStars(avgRating)}</div>
              <span className="text-xs text-charcoal-400">
                ({reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mt-auto pt-2">
            <span className="text-charcoal-100 font-semibold text-base">
              {formatPrice(product.price)}
            </span>
            {product.compareAt && product.compareAt > product.price && (
              <span className="text-charcoal-500 line-through text-sm">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
