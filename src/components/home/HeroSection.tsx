import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(217,154,43,0.08)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(217,154,43,0.05)_0%,_transparent_60%)]" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold-400/3 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 py-24 lg:py-36">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-charcoal-900/80 border border-charcoal-700 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-gold-400" />
            <span className="text-sm text-charcoal-300 font-medium">
              Premium Lifestyle Essentials
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-charcoal-100 leading-tight tracking-tight">
            Discover Premium{" "}
            <span className="gold-text">Lifestyle Products</span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-lg lg:text-xl text-charcoal-300 max-w-2xl mx-auto leading-relaxed">
            Curated collections across beauty, wellness, tech, and more.
            Elevate your everyday with products handpicked for quality and style.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              Shop Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/categories/beauty"
              className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              Explore Categories
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-charcoal-400 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              <span>Free Shipping Over $50</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              <span>30-Day Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-charcoal-950 to-transparent" />
    </section>
  );
}
