import { Star } from "lucide-react";
import { cn } from "@/lib/utils/format";

type ReviewSummaryProps = {
  averageRating: number;
  reviewCount: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeConfig = {
  sm: {
    rating: "text-lg font-bold",
    star: "h-3.5 w-3.5",
    count: "text-xs",
    gap: "gap-1.5",
  },
  md: {
    rating: "text-2xl font-bold",
    star: "h-4 w-4",
    count: "text-sm",
    gap: "gap-2",
  },
  lg: {
    rating: "text-4xl font-bold",
    star: "h-5 w-5",
    count: "text-base",
    gap: "gap-3",
  },
};

export default function ReviewSummary({
  averageRating,
  reviewCount,
  size = "md",
  className,
}: ReviewSummaryProps) {
  const config = sizeConfig[size];
  const clampedRating = Math.min(Math.max(averageRating, 0), 5);
  const fullStars = Math.floor(clampedRating);
  const hasHalf = clampedRating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  if (reviewCount === 0) {
    return (
      <div className={cn("inline-flex items-center", config.gap, className)}>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(config.star, "text-charcoal-600")}
            />
          ))}
        </div>
        <span className={cn(config.count, "text-charcoal-500")}>
          No reviews
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn("inline-flex items-center", config.gap, className)}
      aria-label={`${clampedRating.toFixed(1)} out of 5 stars based on ${reviewCount} reviews`}
    >
      {/* Numeric Rating */}
      <span className={cn(config.rating, "text-charcoal-100")}>
        {clampedRating.toFixed(1)}
      </span>

      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(config.star, "fill-gold-400 text-gold-400")}
          />
        ))}
        {hasHalf && (
          <div className="relative">
            <Star className={cn(config.star, "text-charcoal-600")} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={cn(config.star, "fill-gold-400 text-gold-400")} />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(config.star, "text-charcoal-600")}
          />
        ))}
      </div>

      {/* Review Count */}
      <span className={cn(config.count, "text-charcoal-400")}>
        ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
}
