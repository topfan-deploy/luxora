"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils/format";
import { useCart } from "@/context/CartContext";

const categories = [
  { name: "Beauty", slug: "beauty" },
  { name: "Health & Wellness", slug: "health-wellness" },
  { name: "Tech & Gadgets", slug: "tech-gadgets" },
  { name: "Fitness", slug: "fitness" },
  { name: "Eco-Friendly", slug: "eco-friendly" },
  { name: "Fashion", slug: "fashion" },
  { name: "Pet Care", slug: "pet-care" },
  { name: "Smart Home", slug: "smart-home" },
  { name: "Gaming", slug: "gaming" },
  { name: "Cycling", slug: "cycling" },
];

export default function Header() {
  const { data: session } = useSession();
  const { itemCount: totalItems } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categoriesRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?query=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gold-400 text-charcoal-950 text-center py-1.5 text-sm font-medium">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2">
          <Truck className="h-4 w-4" />
          <span>Free shipping on orders over $75</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-charcoal-950/95 backdrop-blur-md border-b border-charcoal-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-charcoal-200 hover:text-gold-400 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="gold-text font-heading text-2xl lg:text-3xl font-bold tracking-wide"
            >
              Luxora
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <Link
                href="/shop"
                className="text-charcoal-200 hover:text-gold-400 transition-colors font-medium"
              >
                Shop
              </Link>

              {/* Categories Dropdown */}
              <div ref={categoriesRef} className="relative">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center gap-1 text-charcoal-200 hover:text-gold-400 transition-colors font-medium"
                >
                  Categories
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      categoriesOpen && "rotate-180"
                    )}
                  />
                </button>

                {categoriesOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-charcoal-900 border border-charcoal-700 rounded-xl shadow-xl animate-slide-down overflow-hidden">
                    <div className="py-2">
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/categories/${category.slug}`}
                          className="block px-5 py-2.5 text-charcoal-200 hover:bg-charcoal-800 hover:text-gold-400 transition-colors text-sm"
                          onClick={() => setCategoriesOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className="text-charcoal-200 hover:text-gold-400 transition-colors font-medium"
              >
                About
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-charcoal-200 hover:text-gold-400 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Account */}
              <Link
                href={session ? "/account" : "/login"}
                className="hidden sm:block text-charcoal-200 hover:text-gold-400 transition-colors"
                aria-label={session ? "My account" : "Sign in"}
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden sm:block text-charcoal-200 hover:text-gold-400 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative text-charcoal-200 hover:text-gold-400 transition-colors"
                aria-label={`Shopping cart with ${totalItems} items`}
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-gold-400 text-charcoal-950 text-xs font-bold rounded-full">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-charcoal-800 animate-slide-down">
            <div className="container mx-auto px-4 py-4">
              <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="input-field pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-200 transition-colors"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-charcoal-900 shadow-2xl animate-slide-right overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-charcoal-700">
              <span className="gold-text font-heading text-xl font-bold">
                Luxora
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-charcoal-300 hover:text-charcoal-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="p-5">
              <div className="space-y-1">
                <Link
                  href="/shop"
                  className="block py-3 px-3 text-charcoal-200 hover:text-gold-400 hover:bg-charcoal-800 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop
                </Link>

                <div>
                  <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="w-full flex items-center justify-between py-3 px-3 text-charcoal-200 hover:text-gold-400 hover:bg-charcoal-800 rounded-lg transition-colors font-medium"
                  >
                    Categories
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        categoriesOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {categoriesOpen && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-charcoal-700 pl-4">
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/categories/${category.slug}`}
                          className="block py-2 px-3 text-sm text-charcoal-300 hover:text-gold-400 hover:bg-charcoal-800 rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/about"
                  className="block py-3 px-3 text-charcoal-200 hover:text-gold-400 hover:bg-charcoal-800 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-charcoal-700 space-y-1">
                <Link
                  href={session ? "/account" : "/login"}
                  className="flex items-center gap-3 py-3 px-3 text-charcoal-200 hover:text-gold-400 hover:bg-charcoal-800 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  {session ? "My Account" : "Sign In"}
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 py-3 px-3 text-charcoal-200 hover:text-gold-400 hover:bg-charcoal-800 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-5 w-5" />
                  Wishlist
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center gap-3 py-3 px-3 text-charcoal-200 hover:text-gold-400 hover:bg-charcoal-800 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingBag className="h-5 w-5" />
                  Cart
                  {totalItems > 0 && (
                    <span className="ml-auto bg-gold-400 text-charcoal-950 text-xs font-bold px-2 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
