import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Refunds | Luxora",
  description:
    "Learn about Luxora return policy, refund timeline, and how to initiate a return or exchange.",
};

const eligibleItems = [
  "Unused and unworn items in original condition",
  "Items with all original tags and packaging intact",
  "Items returned within 30 days of delivery",
  "Defective or damaged items (contact us within 48 hours)",
  "Incorrect items received due to our error",
];

const nonEligibleItems = [
  "Personal care items that have been opened or used (hygiene reasons)",
  "Customized or personalized products",
  "Gift cards and digital products",
  "Items marked as final sale or clearance",
  "Items returned after the 30-day return window",
  "Items that show signs of wear, damage, or alteration",
];

const returnSteps = [
  {
    step: 1,
    title: "Request a Return",
    description:
      "Log into your account, navigate to 'My Orders', select the order containing the item you wish to return, and click 'Request Return'. Select the items and provide a reason.",
  },
  {
    step: 2,
    title: "Receive Your Label",
    description:
      "Once your return request is approved, you will receive a prepaid return shipping label via email within 24 hours. Print the label and attach it to your package.",
  },
  {
    step: 3,
    title: "Pack & Ship",
    description:
      "Pack the items securely in their original packaging if possible. Attach the prepaid label and drop the package off at the nearest designated shipping location.",
  },
  {
    step: 4,
    title: "Receive Your Refund",
    description:
      "Once we receive and inspect your return (typically 2-3 business days after arrival), your refund will be processed to your original payment method within 3-5 business days.",
  },
];

const refundTimeline = [
  {
    method: "Credit / Debit Card",
    processing: "3-5 business days",
    appearing: "5-10 business days on statement",
  },
  {
    method: "PayPal",
    processing: "3-5 business days",
    appearing: "Immediate to PayPal balance",
  },
  {
    method: "M-Pesa",
    processing: "3-5 business days",
    appearing: "1-3 business days to M-Pesa wallet",
  },
  {
    method: "MTN Mobile Money",
    processing: "3-5 business days",
    appearing: "1-3 business days to MoMo wallet",
  },
];

export default function ReturnsPage() {
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
              Returns & <span className="gold-text">Refunds</span>
            </h1>
            <p className="mt-4 text-charcoal-300 max-w-xl mx-auto">
              We want you to love every purchase. If something is not right,
              our hassle-free return process has you covered.
            </p>
          </div>
        </section>

        {/* Return Window Banner */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-charcoal-900 border border-gold-400/30 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-full bg-gold-400/10">
                <RotateCcw className="h-6 w-6 text-gold-400" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold text-charcoal-100">
                  30-Day Return Window
                </h2>
                <p className="text-charcoal-300 text-sm mt-1">
                  All eligible items can be returned within 30 days of the delivery
                  date for a full refund or exchange. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Conditions */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-charcoal-100 mb-8">
              Return <span className="gold-text">Conditions</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Eligible */}
              <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <h3 className="font-heading text-lg font-semibold text-charcoal-100">
                    Eligible for Return
                  </h3>
                </div>
                <ul className="space-y-3">
                  {eligibleItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                      <span className="text-sm text-charcoal-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Eligible */}
              <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <h3 className="font-heading text-lg font-semibold text-charcoal-100">
                    Not Eligible for Return
                  </h3>
                </div>
                <ul className="space-y-3">
                  {nonEligibleItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                      <span className="text-sm text-charcoal-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How to Return */}
        <section className="py-12 lg:py-20 bg-charcoal-900/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-charcoal-100 mb-8">
              How to <span className="gold-text">Initiate a Return</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {returnSteps.map((step, index) => (
                <div key={step.step} className="relative">
                  <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6 h-full">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gold-400 text-charcoal-950 font-bold text-sm mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-charcoal-100 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-charcoal-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {/* Arrow between steps (desktop only) */}
                  {index < returnSteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                      <ArrowRight className="h-5 w-5 text-charcoal-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Refund Timeline */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="h-6 w-6 text-gold-400" />
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-charcoal-100">
                Refund <span className="gold-text">Timeline</span>
              </h2>
            </div>

            <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-charcoal-700">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Payment Method
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Processing Time
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Refund Appearing
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {refundTimeline.map((item, index) => (
                      <tr
                        key={item.method}
                        className={
                          index < refundTimeline.length - 1
                            ? "border-b border-charcoal-800"
                            : ""
                        }
                      >
                        <td className="px-6 py-4 text-sm text-charcoal-100 font-medium">
                          {item.method}
                        </td>
                        <td className="px-6 py-4 text-sm text-charcoal-300">
                          {item.processing}
                        </td>
                        <td className="px-6 py-4 text-sm text-charcoal-400">
                          {item.appearing}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="mt-6 text-sm text-charcoal-400">
              Please note: Refund processing begins after we receive and inspect
              the returned item. Shipping costs are non-refundable unless the
              return is due to a defective or incorrect item.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
