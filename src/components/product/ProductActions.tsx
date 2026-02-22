"use client";

import { useState } from "react";
import { ShoppingCart, Heart, Minus, Plus, Loader2 } from "lucide-react";

type ProductActionsProps = {
  productId: string;
  productName: string;
  price: number;
  image: string;
  slug: string;
  stock: number;
};

export default function ProductActions(props: ProductActionsProps) {
  const { stock } = props;
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(stock, prev + 1));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (stock === 0) return;
    setIsAddingToCart(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Integration point: call CartContext.addItem here
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = () => {
    setIsWishlisted((prev) => !prev);
  };

  const isOutOfStock = stock === 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div
          className={`h-2.5 w-2.5 rounded-full ${
            isOutOfStock ? "bg-red-500" : stock <= 5 ? "bg-yellow-500" : "bg-green-500"
          }`}
        />
        <span className="text-sm text-charcoal-300">
          {isOutOfStock
            ? "Out of stock"
            : stock <= 5
            ? `Only ${stock} left in stock`
            : "In stock"}
        </span>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-charcoal-300">Quantity</span>
        <div className="flex items-center border border-charcoal-700 rounded-lg overflow-hidden">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1 || isOutOfStock}
            className="px-3 py-2.5 text-charcoal-300 hover:bg-charcoal-800 hover:text-charcoal-100 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min={1}
            max={stock}
            value={quantity}
            onChange={handleQuantityChange}
            disabled={isOutOfStock}
            className="w-14 text-center bg-transparent text-charcoal-100 border-x border-charcoal-700 py-2.5 text-sm font-medium focus:outline-none disabled:opacity-40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={handleIncrement}
            disabled={quantity >= stock || isOutOfStock}
            className="px-3 py-2.5 text-charcoal-300 hover:bg-charcoal-800 hover:text-charcoal-100 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || isOutOfStock}
          className="flex-1 btn-primary flex items-center justify-center gap-2 text-base"
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </>
          )}
        </button>
        <button
          onClick={handleToggleWishlist}
          className={`px-4 py-3 rounded-lg border transition-colors duration-200 ${
            isWishlisted
              ? "bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20"
              : "border-charcoal-700 text-charcoal-300 hover:bg-charcoal-800 hover:text-charcoal-100"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
        </button>
      </div>
    </div>
  );
}
