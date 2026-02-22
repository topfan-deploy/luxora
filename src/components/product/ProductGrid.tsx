import { PackageSearch } from "lucide-react";
import ProductCard from "./ProductCard";

type ProductForCard = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  stock?: number;
  images: { url: string; alt: string | null; isPrimary?: boolean }[];
  category: { name: string; slug?: string };
  avgRating?: number;
  reviewCount?: number;
  [key: string]: unknown;
};

type ProductGridProps = {
  products: ProductForCard[];
  emptyMessage?: string;
};

export default function ProductGrid({
  products,
  emptyMessage = "No products found",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <PackageSearch className="h-16 w-16 text-charcoal-600 mb-4" />
        <h3 className="text-xl font-heading font-semibold text-charcoal-200 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-charcoal-400 max-w-md">
          Try adjusting your filters or search terms to find what you are looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
