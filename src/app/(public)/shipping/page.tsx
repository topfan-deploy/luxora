import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Truck, Clock, Globe, Package, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Policy | Luxora",
  description:
    "Learn about Luxora shipping options, delivery times, rates, and tracking information.",
};

const shippingMethods = [
  {
    icon: Truck,
    name: "Standard Shipping",
    time: "5-7 Business Days",
    price: "Free on orders over $50",
    subPrice: "$4.99 for orders under $50",
    description:
      "Our most economical option. Reliable delivery with full tracking for all domestic orders.",
  },
  {
    icon: Clock,
    name: "Express Shipping",
    time: "2-3 Business Days",
    price: "$12.99",
    subPrice: null,
    description:
      "Need it fast? Express shipping ensures your order arrives in just 2-3 business days.",
  },
  {
    icon: Globe,
    name: "International Shipping",
    time: "7-14 Business Days",
    price: "From $14.99",
    subPrice: "Varies by destination",
    description:
      "We ship to over 50 countries worldwide. Rates and delivery times vary by destination.",
  },
];

const shippingRates = [
  {
    destination: "Continental US",
    standard: "Free (over $50) / $4.99",
    express: "$12.99",
    notes: "All 48 contiguous states",
  },
  {
    destination: "Alaska & Hawaii",
    standard: "$7.99",
    express: "$19.99",
    notes: "Extended delivery times may apply",
  },
  {
    destination: "Canada",
    standard: "$14.99",
    express: "$24.99",
    notes: "Customs duties may apply",
  },
  {
    destination: "Europe (EU/UK)",
    standard: "$17.99",
    express: "$29.99",
    notes: "VAT and import duties may apply",
  },
  {
    destination: "Australia & NZ",
    standard: "$19.99",
    express: "$34.99",
    notes: "GST may apply at customs",
  },
  {
    destination: "Rest of World",
    standard: "$22.99",
    express: "$39.99",
    notes: "Contact us for specific countries",
  },
];

export default function ShippingPage() {
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
              Shipping <span className="gold-text">Policy</span>
            </h1>
            <p className="mt-4 text-charcoal-300 max-w-xl mx-auto">
              Everything you need to know about our shipping options, rates, and
              delivery times.
            </p>
          </div>
        </section>

        {/* Shipping Methods */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-charcoal-100 mb-8">
              Shipping <span className="gold-text">Methods</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {shippingMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <div
                    key={method.name}
                    className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6 hover:border-charcoal-600 transition-colors duration-200"
                  >
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-charcoal-800 mb-4">
                      <IconComponent className="h-6 w-6 text-gold-400" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-charcoal-100">
                      {method.name}
                    </h3>
                    <p className="text-gold-400 font-medium text-sm mt-1">
                      {method.time}
                    </p>
                    <div className="mt-3 space-y-1">
                      <p className="text-charcoal-200 font-semibold">
                        {method.price}
                      </p>
                      {method.subPrice && (
                        <p className="text-charcoal-400 text-sm">
                          {method.subPrice}
                        </p>
                      )}
                    </div>
                    <p className="mt-4 text-sm text-charcoal-400 leading-relaxed">
                      {method.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Shipping Rates Table */}
        <section className="py-12 lg:py-20 bg-charcoal-900/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-charcoal-100 mb-8">
              Shipping <span className="gold-text">Rates</span>
            </h2>

            <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-charcoal-700">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Destination
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Standard
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Express
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {shippingRates.map((rate, index) => (
                      <tr
                        key={rate.destination}
                        className={
                          index < shippingRates.length - 1
                            ? "border-b border-charcoal-800"
                            : ""
                        }
                      >
                        <td className="px-6 py-4 text-sm text-charcoal-100 font-medium">
                          {rate.destination}
                        </td>
                        <td className="px-6 py-4 text-sm text-charcoal-300">
                          {rate.standard}
                        </td>
                        <td className="px-6 py-4 text-sm text-charcoal-300">
                          {rate.express}
                        </td>
                        <td className="px-6 py-4 text-sm text-charcoal-400">
                          {rate.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Order Tracking */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Tracking Info */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-charcoal-800">
                    <Package className="h-5 w-5 text-gold-400" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-charcoal-100">
                    Order Tracking
                  </h2>
                </div>
                <div className="space-y-4 text-charcoal-300 leading-relaxed">
                  <p>
                    Once your order has been shipped, you will receive a shipping
                    confirmation email containing your tracking number and a link
                    to track your package in real-time.
                  </p>
                  <p>
                    You can also track your order at any time by logging into your
                    account and visiting the &ldquo;My Orders&rdquo; section. Each order
                    includes detailed status updates from dispatch to delivery.
                  </p>
                  <p>
                    Please allow up to 24 hours after receiving your shipping
                    confirmation for the tracking information to become active in
                    the carrier&apos;s system.
                  </p>
                </div>
              </div>

              {/* Important Info */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-charcoal-800">
                    <MapPin className="h-5 w-5 text-gold-400" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-charcoal-100">
                    Important Information
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="bg-charcoal-900 border border-charcoal-700 rounded-lg p-4">
                    <h4 className="text-charcoal-100 font-medium mb-1">
                      Processing Time
                    </h4>
                    <p className="text-sm text-charcoal-400">
                      Orders are processed within 1-2 business days. Orders placed
                      on weekends or holidays are processed on the next business day.
                    </p>
                  </div>
                  <div className="bg-charcoal-900 border border-charcoal-700 rounded-lg p-4">
                    <h4 className="text-charcoal-100 font-medium mb-1">
                      Customs & Duties
                    </h4>
                    <p className="text-sm text-charcoal-400">
                      International orders may be subject to customs duties and import
                      taxes. These charges are the responsibility of the recipient and
                      are not included in our shipping fees.
                    </p>
                  </div>
                  <div className="bg-charcoal-900 border border-charcoal-700 rounded-lg p-4">
                    <h4 className="text-charcoal-100 font-medium mb-1">
                      Delivery Attempts
                    </h4>
                    <p className="text-sm text-charcoal-400">
                      Carriers will typically make 2-3 delivery attempts. If delivery
                      is unsuccessful, the package may be held at a nearby facility
                      for pickup.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
