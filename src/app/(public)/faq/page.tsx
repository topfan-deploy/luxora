"use client";

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils/format";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQCategory = {
  name: string;
  items: FAQItem[];
};

const faqData: FAQCategory[] = [
  {
    name: "Ordering",
    items: [
      {
        question: "How do I place an order?",
        answer:
          "Simply browse our catalog, add items to your cart, and proceed to checkout. You can check out as a guest or create an account for faster future purchases and order tracking.",
      },
      {
        question: "Can I modify or cancel my order after placing it?",
        answer:
          "You can modify or cancel your order within 1 hour of placing it, provided it has not yet entered the processing stage. Contact our support team immediately if you need to make changes.",
      },
      {
        question: "Is there a minimum order amount?",
        answer:
          "There is no minimum order amount. However, orders over $50 qualify for free standard shipping within the continental United States.",
      },
      {
        question: "Can I order items that are out of stock?",
        answer:
          "Out-of-stock items cannot be ordered directly. However, you can add them to your wishlist and enable notifications to be alerted when they are back in stock.",
      },
    ],
  },
  {
    name: "Shipping",
    items: [
      {
        question: "What shipping options are available?",
        answer:
          "We offer Standard Shipping (5-7 business days), Express Shipping (2-3 business days), and International Shipping (7-14 business days). Shipping rates vary by destination and order weight.",
      },
      {
        question: "How much does shipping cost?",
        answer:
          "Standard shipping is free on orders over $50. For orders under $50, standard shipping is $4.99 and express shipping is $12.99. International shipping rates start at $14.99 and vary by destination.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order ships, you will receive a confirmation email with a tracking number. You can also view tracking details in your account under 'My Orders'.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship to over 50 countries worldwide. International orders may be subject to customs duties and import taxes, which are the responsibility of the recipient.",
      },
    ],
  },
  {
    name: "Returns",
    items: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return window from the date of delivery. Items must be unused, in their original packaging, and in resalable condition. Some items like personal care products may have specific return restrictions.",
      },
      {
        question: "How do I initiate a return?",
        answer:
          "Log into your account, go to 'My Orders', select the order, and click 'Request Return'. You will receive a prepaid return label via email. Pack the items securely and drop them off at the nearest shipping location.",
      },
      {
        question: "How long does a refund take?",
        answer:
          "Once we receive and inspect your return, refunds are processed within 3-5 business days. The refund will be credited to your original payment method and may take an additional 5-10 business days to appear on your statement.",
      },
      {
        question: "Can I exchange an item instead of returning it?",
        answer:
          "Yes, you can request an exchange for a different size, color, or variant of the same product. If the desired variant is available, we will ship it once we receive your return.",
      },
    ],
  },
  {
    name: "Payments",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, M-Pesa, and MTN Mobile Money. All transactions are secured with SSL encryption.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Absolutely. We use industry-standard SSL/TLS encryption and never store your full credit card details. Payments are processed through PCI-DSS compliant payment providers including Stripe.",
      },
      {
        question: "Do you offer payment plans or installments?",
        answer:
          "Currently, we do not offer installment payment plans. However, certain credit card providers may offer their own installment options at checkout.",
      },
    ],
  },
  {
    name: "Account",
    items: [
      {
        question: "How do I create an account?",
        answer:
          "Click the user icon in the header or visit our registration page. You can sign up with your email address and a password, or use social login options for faster access.",
      },
      {
        question: "I forgot my password. How can I reset it?",
        answer:
          "Click 'Forgot Password' on the login page, enter your registered email address, and we will send you a password reset link. The link expires after 24 hours.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes, you can request account deletion from your account settings or by contacting our support team. Please note that account deletion is permanent and cannot be undone.",
      },
      {
        question: "How do I update my shipping address?",
        answer:
          "Log into your account, navigate to 'Addresses' in your account settings, and add, edit, or remove your saved addresses. You can also set a default shipping address.",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return faqData
      .filter((cat) => !activeCategory || cat.name === activeCategory)
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            !query ||
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [searchQuery, activeCategory]);

  const totalResults = filteredData.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(217,154,43,0.06)_0%,_transparent_70%)]" />
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-charcoal-100">
              Frequently Asked <span className="gold-text">Questions</span>
            </h1>
            <p className="mt-4 text-charcoal-300 max-w-xl mx-auto">
              Find answers to common questions about ordering, shipping, returns,
              and more.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a question..."
                className="input-field pl-12"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                  activeCategory === null
                    ? "bg-gold-400 text-charcoal-950"
                    : "bg-charcoal-800 text-charcoal-300 hover:bg-charcoal-700 hover:text-charcoal-100"
                )}
              >
                All
              </button>
              {faqData.map((category) => (
                <button
                  key={category.name}
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === category.name ? null : category.name
                    )
                  }
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                    activeCategory === category.name
                      ? "bg-gold-400 text-charcoal-950"
                      : "bg-charcoal-800 text-charcoal-300 hover:bg-charcoal-700 hover:text-charcoal-100"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Results Count */}
            {searchQuery && (
              <p className="text-sm text-charcoal-400 mb-6">
                {totalResults} result{totalResults !== 1 ? "s" : ""} found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            )}

            {/* FAQ Accordion */}
            {filteredData.length > 0 ? (
              <div className="space-y-8">
                {filteredData.map((category) => (
                  <div key={category.name}>
                    <h2 className="font-heading text-xl font-semibold text-gold-400 mb-4">
                      {category.name}
                    </h2>
                    <div className="space-y-3">
                      {category.items.map((item, index) => {
                        const key = `${category.name}-${index}`;
                        const isOpen = openItems.has(key);

                        return (
                          <div
                            key={key}
                            className="bg-charcoal-900 border border-charcoal-700 rounded-xl overflow-hidden"
                          >
                            <button
                              onClick={() => toggleItem(key)}
                              className="w-full flex items-center justify-between p-5 text-left hover:bg-charcoal-800/50 transition-colors duration-200"
                            >
                              <span className="text-charcoal-100 font-medium pr-4">
                                {item.question}
                              </span>
                              <ChevronDown
                                className={cn(
                                  "h-5 w-5 text-charcoal-400 flex-shrink-0 transition-transform duration-300",
                                  isOpen && "rotate-180 text-gold-400"
                                )}
                              />
                            </button>
                            <div
                              className={cn(
                                "grid transition-all duration-300 ease-in-out",
                                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                              )}
                            >
                              <div className="overflow-hidden">
                                <p className="px-5 pb-5 text-charcoal-300 leading-relaxed">
                                  {item.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-charcoal-400 text-lg">
                  No results found. Try adjusting your search or category filter.
                </p>
              </div>
            )}

            {/* Contact CTA */}
            <div className="mt-16 bg-charcoal-900 border border-charcoal-700 rounded-xl p-8 text-center">
              <h3 className="font-heading text-xl font-semibold text-charcoal-100 mb-2">
                Still have questions?
              </h3>
              <p className="text-charcoal-400 mb-6">
                Our support team is ready to help you with anything not covered here.
              </p>
              <a
                href="/contact"
                className="btn-primary inline-flex items-center gap-2"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
