export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewsletterSection from "@/components/home/NewsletterSection";
import { Truck, Shield, Award, Headphones } from "lucide-react";

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      include: {
        images: {
          select: {
            url: true,
            alt: true,
            isPrimary: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    });

    return products.map((product) => {
      const ratings = product.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        compareAt: product.compareAt,
        stock: product.stock,
        images: product.images,
        category: product.category,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: ratings.length,
      };
    });
  } catch {
    // Gracefully handle DB connection failures
    return [];
  }
}

const whyChooseFeatures = [
  {
    icon: Truck,
    title: "Free Shipping",
    description:
      "Enjoy free standard shipping on all orders over $50. Fast, reliable delivery right to your door.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Shop with confidence. Your transactions are protected with industry-leading encryption.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "Every product is carefully vetted and curated to meet our high standards of excellence.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our dedicated team is here around the clock to help with any questions or concerns.",
  },
];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <HeroSection />

        {/* Featured Categories */}
        <CategoryShowcase />

        {/* Featured Products */}
        <FeaturedProducts products={featuredProducts} />

        {/* Why Choose Luxora */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal-100">
                Why Choose <span className="gold-text">Luxora</span>
              </h2>
              <p className="mt-4 text-charcoal-400 max-w-2xl mx-auto">
                We go above and beyond to deliver an exceptional shopping experience.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseFeatures.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6 text-center hover:border-charcoal-600 transition-colors duration-200"
                  >
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-charcoal-800 mb-5">
                      <IconComponent className="h-6 w-6 text-gold-400" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-charcoal-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-charcoal-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
