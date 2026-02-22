"use client";

import { useState, useEffect } from "react";
import { Star, Loader2, CheckCircle, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils/format";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type ReviewFormProps = {
  productSlug: string;
  onReviewSubmitted?: () => void;
  className?: string;
};

export default function ReviewForm({
  productSlug,
  onReviewSubmitted,
  className,
}: ReviewFormProps) {
  const { data: session, status: sessionStatus } = useSession();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasExistingReview, setHasExistingReview] = useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = useState(false);

  // Check if the user has already reviewed this product
  useEffect(() => {
    if (!session?.user?.id) return;

    const checkExistingReview = async () => {
      setIsCheckingExisting(true);
      try {
        const res = await fetch(
          `/api/products/${productSlug}/reviews?page=1&limit=1`
        );
        const json = await res.json();

        if (json.success && json.data.reviews) {
          const userReview = json.data.reviews.find(
            (r: { user: { id: string } }) => r.user.id === session.user.id
          );
          // Also check across all pages by doing a broader search if not found on first page
          if (!userReview && json.data.pagination.total > 1) {
            const allRes = await fetch(
              `/api/products/${productSlug}/reviews?page=1&limit=${json.data.pagination.total}`
            );
            const allJson = await allRes.json();
            if (allJson.success) {
              const found = allJson.data.reviews.some(
                (r: { user: { id: string } }) => r.user.id === session.user.id
              );
              setHasExistingReview(found);
            }
          } else {
            setHasExistingReview(!!userReview);
          }
        }
      } catch {
        // Silently fail; the server will still enforce uniqueness
      } finally {
        setIsCheckingExisting(false);
      }
    };

    checkExistingReview();
  }, [session?.user?.id, productSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/products/${productSlug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          title: title.trim() || undefined,
          comment: comment.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setHasExistingReview(true);
          return;
        }

        if (json.details) {
          setFieldErrors(json.details);
          return;
        }

        throw new Error(json.error || "Failed to submit review");
      }

      setIsSuccess(true);
      setRating(0);
      setTitle("");
      setComment("");
      onReviewSubmitted?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading session
  if (sessionStatus === "loading" || isCheckingExisting) {
    return (
      <div className={cn("bg-charcoal-900 border border-charcoal-700 rounded-xl p-6", className)}>
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="h-5 w-5 animate-spin text-charcoal-400" />
          <span className="text-charcoal-400 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className={cn("bg-charcoal-900 border border-charcoal-700 rounded-xl p-6", className)}>
        <div className="text-center py-6">
          <LogIn className="h-10 w-10 text-charcoal-600 mx-auto mb-3" />
          <h3 className="text-charcoal-200 font-semibold text-lg mb-2">
            Write a Review
          </h3>
          <p className="text-charcoal-400 text-sm mb-5">
            Sign in to share your experience with this product.
          </p>
          <Link href="/login">
            <Button variant="primary" size="sm">
              Sign In to Review
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Already reviewed
  if (hasExistingReview) {
    return (
      <div className={cn("bg-charcoal-900 border border-charcoal-700 rounded-xl p-6", className)}>
        <div className="flex items-center gap-3 py-4">
          <CheckCircle className="h-5 w-5 text-gold-400 shrink-0" />
          <p className="text-charcoal-300 text-sm">
            You have already reviewed this product. Thank you for your feedback!
          </p>
        </div>
      </div>
    );
  }

  // Success message
  if (isSuccess) {
    return (
      <div className={cn("bg-charcoal-900 border border-charcoal-700 rounded-xl p-6", className)}>
        <div className="text-center py-6">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
          <h3 className="text-charcoal-100 font-semibold text-lg mb-1">
            Review Submitted
          </h3>
          <p className="text-charcoal-400 text-sm">
            Thank you for sharing your experience!
          </p>
        </div>
      </div>
    );
  }

  const displayRating = hoveredRating || rating;

  return (
    <div className={cn("bg-charcoal-900 border border-charcoal-700 rounded-xl p-6", className)}>
      <h3 className="text-charcoal-100 font-semibold text-lg mb-5">
        Write a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Star Rating Selector */}
        <div>
          <label className="block text-sm font-medium text-charcoal-200 mb-2">
            Rating <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => {
              const starValue = i + 1;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoveredRating(starValue)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-0.5 transition-transform duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
                  aria-label={`Rate ${starValue} out of 5`}
                >
                  <Star
                    className={cn(
                      "h-7 w-7 transition-colors duration-150",
                      starValue <= displayRating
                        ? "fill-gold-400 text-gold-400"
                        : "fill-charcoal-700 text-charcoal-700 hover:text-charcoal-500"
                    )}
                  />
                </button>
              );
            })}
            {displayRating > 0 && (
              <span className="ml-2 text-sm text-charcoal-400">
                {displayRating} / 5
              </span>
            )}
          </div>
          {error && error.includes("rating") && (
            <p className="mt-1.5 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Title */}
        <Input
          name="title"
          label="Title (optional)"
          placeholder="Summarize your experience"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          error={fieldErrors.title?.[0]}
          disabled={isSubmitting}
        />

        {/* Comment */}
        <div>
          <label
            htmlFor="review-comment"
            className="block text-sm font-medium text-charcoal-200 mb-1.5"
          >
            Comment (optional)
          </label>
          <textarea
            id="review-comment"
            name="comment"
            placeholder="Share the details of your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={4}
            disabled={isSubmitting}
            className={cn(
              "input-field resize-none",
              fieldErrors.comment && "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
          />
          <div className="flex items-center justify-between mt-1.5">
            {fieldErrors.comment?.[0] ? (
              <p className="text-sm text-red-400" role="alert">
                {fieldErrors.comment[0]}
              </p>
            ) : (
              <span />
            )}
            <span className="text-xs text-charcoal-500">
              {comment.length} / 1000
            </span>
          </div>
        </div>

        {/* General Error */}
        {error && !error.includes("rating") && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          disabled={rating === 0}
          className="w-full sm:w-auto"
        >
          Submit Review
        </Button>
      </form>
    </div>
  );
}
