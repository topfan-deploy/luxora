import { Star } from "lucide-react";
import { cn } from "@/lib/utils/format";

type RatingProps = {
  value: number;
  max?: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses: Record<string, { star: string; text: string }> = {
  sm: { star: "h-3.5 w-3.5", text: "text-xs" },
  md: { star: "h-4 w-4", text: "text-sm" },
  lg: { star: "h-5 w-5", text: "text-base" },
};

export function Rating({
  value,
  max = 5,
  count,
  size = "md",
  className,
}: RatingProps) {
  const { star: starSize, text: textSize } = sizeClasses[size];
  const clampedValue = Math.min(Math.max(value, 0), max);
  const fullStars = Math.floor(clampedValue);
  const hasHalf = clampedValue - fullStars >= 0.5;
  const emptyStars = max - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="flex items-center" aria-label={`Rating: ${value} out of ${max}`}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(starSize, "fill-gold-400 text-gold-400")}
          />
        ))}
        {hasHalf && (
          <div className="relative">
            <Star className={cn(starSize, "text-charcoal-600")} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={cn(starSize, "fill-gold-400 text-gold-400")} />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(starSize, "text-charcoal-600")}
          />
        ))}
      </div>
      {typeof count === "number" && (
        <span className={cn(textSize, "text-charcoal-400 ml-1")}>
          ({count})
        </span>
      )}
    </div>
  );
}

export { type RatingProps };
