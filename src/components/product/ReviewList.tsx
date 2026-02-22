"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, User } from "lucide-react";
import { formatDate, cn } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

type ReviewUser = {
  id: string;
  name: string | null;
  image: string | null;
};

type Review = {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  userId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
};

type ReviewsResponse = {
  success: boolean;
  data: {
    reviews: Review[];
    averageRating: number;
    ratingDistribution: Record<number, number>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

type ReviewListProps = {
  productSlug: string;
  className?: string;
};

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            starSize,
            i < rating
              ? "fill-gold-400 text-gold-400"
              : "fill-charcoal-700 text-charcoal-700"
          )}
        />
      ))}
    </div>
  );
}

function RatingBar({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-charcoal-300 w-8 text-right shrink-0">
        {star} <Star className="inline h-3 w-3 fill-charcoal-400 text-charcoal-400 -mt-0.5" />
      </span>
      <div className="flex-1 h-2.5 bg-charcoal-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-charcoal-400 w-8 shrink-0">{count}</span>
    </div>
  );
}

function UserAvatar({ user }: { user: ReviewUser }) {
  if (user.image) {
    return (
      <img
        src={user.image}
        alt={user.name || "User"}
        className="h-10 w-10 rounded-full object-cover border border-charcoal-700"
      />
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  return (
    <div className="h-10 w-10 rounded-full bg-charcoal-800 border border-charcoal-700 flex items-center justify-center">
      {initials ? (
        <span className="text-sm font-semibold text-charcoal-300">{initials}</span>
      ) : (
        <User className="h-5 w-5 text-charcoal-400" />
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5">
      <div className="flex items-start gap-4">
        <UserAvatar user={review.user} />

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-charcoal-100 font-medium text-sm">
              {review.user.name || "Anonymous"}
            </span>
            {review.isVerified && (
              <Badge variant="green">Verified Purchase</Badge>
            )}
          </div>

          {/* Stars and date */}
          <div className="flex items-center gap-3 mt-1.5">
            <StarDisplay rating={review.rating} />
            <span className="text-xs text-charcoal-400">
              {formatDate(review.createdAt)}
            </span>
          </div>

          {/* Title */}
          {review.title && (
            <h4 className="text-charcoal-100 font-semibold text-base mt-3">
              {review.title}
            </h4>
          )}

          {/* Comment */}
          {review.comment && (
            <p className="text-charcoal-300 text-sm leading-relaxed mt-2">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5"
        >
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReviewList({ productSlug, className }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(
    async (pageNum: number, append = false) => {
      try {
        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const res = await fetch(
          `/api/products/${productSlug}/reviews?page=${pageNum}&limit=10`
        );
        const json: ReviewsResponse = await res.json();

        if (!json.success) {
          throw new Error("Failed to load reviews");
        }

        const { data } = json;

        if (append) {
          setReviews((prev) => [...prev, ...data.reviews]);
        } else {
          setReviews(data.reviews);
        }

        setAverageRating(data.averageRating);
        setTotalCount(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
        setRatingDistribution(data.ratingDistribution);
        setPage(pageNum);
      } catch {
        setError("Failed to load reviews. Please try again.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [productSlug]
  );

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      fetchReviews(page + 1, true);
    }
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-8", className)}>
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <ReviewListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-charcoal-400 mb-4">{error}</p>
        <Button variant="secondary" size="sm" onClick={() => fetchReviews(1)}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Review Summary Header */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center lg:items-start gap-2 lg:min-w-[200px]">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-charcoal-100">
              {averageRating > 0 ? averageRating.toFixed(1) : "--"}
            </span>
            <span className="text-lg text-charcoal-400">/ 5</span>
          </div>
          <StarDisplay
            rating={Math.round(averageRating)}
            size="md"
          />
          <p className="text-sm text-charcoal-400">
            {totalCount} {totalCount === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Rating Distribution */}
        {totalCount > 0 && (
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <RatingBar
                key={star}
                star={star}
                count={ratingDistribution[star] || 0}
                total={totalCount}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reviews List */}
      {totalCount === 0 ? (
        <div className="text-center py-12 bg-charcoal-900 border border-charcoal-700 rounded-xl">
          <Star className="h-12 w-12 text-charcoal-700 mx-auto mb-3" />
          <p className="text-charcoal-400 text-lg font-medium">No reviews yet</p>
          <p className="text-charcoal-500 text-sm mt-1">
            Be the first to review this product.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Load More */}
      {page < totalPages && (
        <div className="flex justify-center pt-2">
          <Button
            variant="secondary"
            size="md"
            isLoading={isLoadingMore}
            onClick={handleLoadMore}
          >
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
}
