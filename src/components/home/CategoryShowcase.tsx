import Link from "next/link";
import {
  Sparkles,
  Heart,
  Cpu,
  Dumbbell,
  Leaf,
  Shirt,
  PawPrint,
  Home,
  Gamepad2,
  Bike,
} from "lucide-react";

const categories = [
  {
    name: "Beauty",
    slug: "beauty",
    description: "Skincare, makeup, and self-care essentials for your glow-up routine.",
    icon: Sparkles,
  },
  {
    name: "Health & Wellness",
    slug: "health-wellness",
    description: "Supplements, vitamins, and wellness products for a balanced life.",
    icon: Heart,
  },
  {
    name: "Tech & Gadgets",
    slug: "tech-gadgets",
    description: "Cutting-edge devices and accessories for the modern tech enthusiast.",
    icon: Cpu,
  },
  {
    name: "Fitness",
    slug: "fitness",
    description: "Equipment, apparel, and gear to power your fitness journey.",
    icon: Dumbbell,
  },
  {
    name: "Eco-Friendly",
    slug: "eco-friendly",
    description: "Sustainable and environmentally conscious products for mindful living.",
    icon: Leaf,
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Trending styles, timeless pieces, and curated fashion finds.",
    icon: Shirt,
  },
  {
    name: "Pet Care",
    slug: "pet-care",
    description: "Premium food, toys, and accessories for your beloved companions.",
    icon: PawPrint,
  },
  {
    name: "Smart Home",
    slug: "smart-home",
    description: "Intelligent devices to automate and elevate your living space.",
    icon: Home,
  },
  {
    name: "Gaming",
    slug: "gaming",
    description: "Consoles, controllers, and the hottest game titles for every gamer.",
    icon: Gamepad2,
  },
  {
    name: "Cycling",
    slug: "cycling",
    description: "Road, mountain, and e-bikes plus premium accessories for every ride.",
    icon: Bike,
  },
];

export default function CategoryShowcase() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal-100">
            Shop by <span className="gold-text">Category</span>
          </h2>
          <p className="mt-4 text-charcoal-400 max-w-2xl mx-auto">
            Explore our curated collections across ten premium lifestyle categories.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group"
              >
                <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6 h-full transition-all duration-300 hover:border-gold-400 hover:shadow-lg hover:shadow-gold-400/5">
                  {/* Icon */}
                  <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-charcoal-800 text-gold-400 mb-4 group-hover:bg-gold-400 group-hover:text-charcoal-950 transition-colors duration-300">
                    <IconComponent className="h-6 w-6" />
                  </div>

                  {/* Name */}
                  <h3 className="font-heading text-lg font-semibold text-charcoal-100 group-hover:text-gold-400 transition-colors duration-200">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm text-charcoal-400 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Link */}
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Shop Now
                    <svg
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
