"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

type Category = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
};

type ProductFiltersProps = {
  categories: Category[];
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
] as const;

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sortBy") || "newest";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);

  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      if (resetPage) {
        params.delete("page");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const prevMinRef = useRef(debouncedMinPrice);
  const prevMaxRef = useRef(debouncedMaxPrice);

  useEffect(() => {
    if (prevMinRef.current === debouncedMinPrice && prevMaxRef.current === debouncedMaxPrice) {
      return;
    }
    prevMinRef.current = debouncedMinPrice;
    prevMaxRef.current = debouncedMaxPrice;
    updateSearchParams({
      minPrice: debouncedMinPrice || null,
      maxPrice: debouncedMaxPrice || null,
    });
  }, [debouncedMinPrice, debouncedMaxPrice, updateSearchParams]);

  const handleCategoryChange = (slug: string) => {
    updateSearchParams({
      category: currentCategory === slug ? null : slug,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams({ sortBy: e.target.value });
  };

  const handleClearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters =
    currentCategory || currentMinPrice || currentMaxPrice || currentSort !== "newest";

  const filterContent = (
    <div className="flex flex-col gap-6">
      {/* Sort - shown only in sidebar on mobile */}
      <div className="lg:hidden">
        <label className="block text-sm font-medium text-charcoal-200 mb-2">
          Sort By
        </label>
        <select
          value={currentSort}
          onChange={handleSortChange}
          className="input-field text-sm"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <button
          onClick={() => setIsCategoryOpen((prev) => !prev)}
          className="flex items-center justify-between w-full text-sm font-semibold text-charcoal-100 uppercase tracking-wider mb-3"
        >
          Categories
          {isCategoryOpen ? (
            <ChevronUp className="h-4 w-4 text-charcoal-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-charcoal-400" />
          )}
        </button>
        {isCategoryOpen && (
          <div className="flex flex-col gap-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={currentCategory === category.slug}
                  onChange={() => handleCategoryChange(category.slug)}
                  className="h-4 w-4 rounded border-charcoal-600 bg-charcoal-800 text-gold-400 focus:ring-gold-400 focus:ring-offset-0 cursor-pointer accent-gold-400"
                />
                <span className="text-sm text-charcoal-300 group-hover:text-charcoal-100 transition-colors flex-1">
                  {category.name}
                </span>
                <span className="text-xs text-charcoal-500">
                  ({category.productCount})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <button
          onClick={() => setIsPriceOpen((prev) => !prev)}
          className="flex items-center justify-between w-full text-sm font-semibold text-charcoal-100 uppercase tracking-wider mb-3"
        >
          Price Range
          {isPriceOpen ? (
            <ChevronUp className="h-4 w-4 text-charcoal-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-charcoal-400" />
          )}
        </button>
        {isPriceOpen && (
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-charcoal-400 mb-1">Min</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="$0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="input-field text-sm py-2 px-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="flex items-end pb-2.5 text-charcoal-500">-</div>
            <div className="flex-1">
              <label className="block text-xs text-charcoal-400 mb-1">Max</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="No max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="input-field text-sm py-2 px-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="text-sm text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1.5 self-start"
        >
          <X className="h-3.5 w-3.5" />
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sort Dropdown */}
      <div className="hidden lg:flex items-center gap-3 mb-6">
        <label className="text-sm text-charcoal-400">Sort by:</label>
        <select
          value={currentSort}
          onChange={handleSortChange}
          className="bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-200 focus:outline-none focus:border-gold-400 cursor-pointer"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-charcoal-900 border border-charcoal-700 rounded-lg text-sm text-charcoal-200 hover:border-charcoal-600 transition-colors mb-4"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <span className="bg-gold-400 text-charcoal-950 text-xs font-bold px-1.5 py-0.5 rounded-full">
            !
          </span>
        )}
      </button>

      {/* Mobile Filter Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-charcoal-900 border-r border-charcoal-700 p-6 overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-charcoal-100">
                Filters
              </h3>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-charcoal-400 hover:text-charcoal-100 transition-colors"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar Filters */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-charcoal-900 border border-charcoal-700 rounded-xl p-5">
          <h3 className="text-lg font-heading font-semibold text-charcoal-100 mb-5">
            Filters
          </h3>
          {filterContent}
        </div>
      </aside>
    </>
  );
}
