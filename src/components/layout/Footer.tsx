"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  ArrowRight,
} from "lucide-react";

const shopLinks = [
  { name: "Beauty", href: "/categories/beauty" },
  { name: "Health & Wellness", href: "/categories/health-wellness" },
  { name: "Tech & Gadgets", href: "/categories/tech-gadgets" },
  { name: "Fitness", href: "/categories/fitness" },
  { name: "Eco-Friendly", href: "/categories/eco-friendly" },
  { name: "Fashion", href: "/categories/fashion" },
  { name: "Pet Care", href: "/categories/pet-care" },
  { name: "Smart Home", href: "/categories/smart-home" },
  { name: "Gaming", href: "/categories/gaming" },
  { name: "Cycling", href: "/categories/cycling" },
];

const serviceLinks = [
  { name: "FAQ", href: "/faq" },
  { name: "Shipping & Delivery", href: "/shipping" },
  { name: "Returns & Exchanges", href: "/returns" },
  { name: "Contact Us", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", icon: Facebook },
  { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "YouTube", href: "https://youtube.com", icon: Youtube },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-900 border-t border-charcoal-700">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* About */}
          <div>
            <Link
              href="/"
              className="gold-text font-heading text-2xl font-bold tracking-wide"
            >
              Luxora
            </Link>
            <p className="mt-4 text-charcoal-300 text-sm leading-relaxed">
              Your premium destination for curated lifestyle products. We bring
              together the finest items across beauty, wellness, tech, and more
              — all in one elevated shopping experience.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-gold-400 font-heading text-lg font-semibold mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-charcoal-300 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-gold-400 font-heading text-lg font-semibold mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-charcoal-300 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-gold-400 font-heading text-lg font-semibold mb-4">
              Connect
            </h3>
            <p className="text-charcoal-300 text-sm mb-4">
              Follow us on social media for the latest products and exclusive
              offers.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-lg bg-charcoal-800 text-charcoal-300 hover:bg-gold-400 hover:text-charcoal-950 transition-colors duration-200"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-charcoal-700">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail className="h-5 w-5 text-gold-400" />
              <h3 className="text-gold-400 font-heading text-lg font-semibold">
                Join the Luxora List
              </h3>
            </div>
            <p className="text-charcoal-300 text-sm mb-5">
              Subscribe for early access to new arrivals, exclusive deals, and
              curated style tips.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field flex-1 text-sm"
                required
              />
              <button
                type="submit"
                className="btn-primary flex items-center gap-2 whitespace-nowrap text-sm"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-charcoal-800">
        <div className="container mx-auto px-4 py-5">
          <p className="text-center text-charcoal-500 text-sm">
            &copy; {currentYear} Luxora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
