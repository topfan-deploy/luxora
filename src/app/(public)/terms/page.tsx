import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Luxora",
  description:
    "Read the Luxora terms of service covering account usage, purchases, payments, and more.",
};

export default function TermsPage() {
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
              Terms of <span className="gold-text">Service</span>
            </h1>
            <p className="mt-4 text-charcoal-300 max-w-xl mx-auto">
              Please read these terms carefully before using the Luxora platform.
            </p>
            <p className="mt-2 text-sm text-charcoal-500">
              Last updated: February 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-12">
              {/* Introduction */}
              <div>
                <p className="text-charcoal-300 leading-relaxed">
                  Welcome to Luxora. These Terms of Service (&ldquo;Terms&rdquo;) govern
                  your use of the Luxora website, mobile applications, and all
                  related services (collectively, the &ldquo;Platform&rdquo;). By accessing
                  or using our Platform, you agree to be bound by these Terms. If
                  you do not agree to these Terms, please do not use our services.
                </p>
              </div>

              {/* Account Terms */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  1. Account Terms
                </h2>
                <div className="space-y-4 text-charcoal-300 leading-relaxed">
                  <p>
                    To access certain features of our Platform, you may need to
                    create an account. When creating an account, you agree to:
                  </p>
                  <ul className="space-y-1.5 ml-4">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Provide accurate, current, and complete information during registration
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Maintain the security of your account credentials and not share your password
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Accept responsibility for all activities that occur under your account
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Notify us immediately of any unauthorized use of your account
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Be at least 18 years of age, or have parental/guardian consent
                    </li>
                  </ul>
                  <p>
                    We reserve the right to suspend or terminate accounts that
                    violate these Terms, engage in fraudulent activity, or are
                    inactive for an extended period.
                  </p>
                </div>
              </div>

              {/* Product Information */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  2. Product Information
                </h2>
                <div className="space-y-4 text-charcoal-300 leading-relaxed">
                  <p>
                    We strive to provide accurate product descriptions, images, and
                    specifications. However:
                  </p>
                  <ul className="space-y-1.5 ml-4">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Product colors may vary slightly due to monitor display settings
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      We reserve the right to limit quantities available for purchase
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Product availability is subject to change without notice
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      We may discontinue any product at any time
                    </li>
                  </ul>
                  <p>
                    If you receive a product that is materially different from its
                    description, you may return it in accordance with our{" "}
                    <a
                      href="/returns"
                      className="text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      Returns Policy
                    </a>
                    .
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  3. Pricing
                </h2>
                <div className="space-y-4 text-charcoal-300 leading-relaxed">
                  <p>
                    All prices displayed on our Platform are in US Dollars (USD) unless
                    otherwise stated. Regarding pricing:
                  </p>
                  <ul className="space-y-1.5 ml-4">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Prices are subject to change without notice prior to order placement
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Prices do not include shipping, taxes, or customs duties unless specified
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      In the event of a pricing error, we reserve the right to cancel
                      the order and notify you
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Promotional prices and coupons may have specific terms and expiration dates
                    </li>
                  </ul>
                </div>
              </div>

              {/* Payment Terms */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  4. Payment Terms
                </h2>
                <div className="space-y-4 text-charcoal-300 leading-relaxed">
                  <p>
                    By making a purchase, you agree to the following payment terms:
                  </p>
                  <ul className="space-y-1.5 ml-4">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      You authorize us to charge the payment method provided at checkout
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Payment is due at the time of purchase and must be received
                      before order processing begins
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      We accept Visa, Mastercard, American Express, PayPal, M-Pesa,
                      and MTN Mobile Money
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      All payment information is processed through PCI-DSS compliant
                      third-party payment providers
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      If payment fails, we reserve the right to cancel the order
                    </li>
                  </ul>
                </div>
              </div>

              {/* Orders and Cancellations */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  5. Orders & Cancellations
                </h2>
                <div className="space-y-4 text-charcoal-300 leading-relaxed">
                  <p>
                    Placing an order constitutes an offer to purchase. We reserve the
                    right to accept or decline any order at our discretion. You may
                    cancel or modify an order within 1 hour of placement, provided
                    the order has not yet entered the processing stage.
                  </p>
                  <p>
                    We may cancel orders due to product unavailability, pricing errors,
                    suspected fraud, or other reasons. If we cancel your order, you
                    will be notified and any payment will be fully refunded.
                  </p>
                </div>
              </div>

              {/* Intellectual Property */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  6. Intellectual Property
                </h2>
                <div className="space-y-4 text-charcoal-300 leading-relaxed">
                  <p>
                    All content on the Luxora Platform — including but not limited to
                    text, graphics, logos, images, product descriptions, and software —
                    is the property of Luxora or its content suppliers and is protected
                    by applicable intellectual property laws.
                  </p>
                  <p>
                    You may not reproduce, distribute, modify, display, or create
                    derivative works from any content on our Platform without prior
                    written consent from Luxora.
                  </p>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  7. Limitation of Liability
                </h2>
                <div className="space-y-4 text-charcoal-300 leading-relaxed">
                  <p>
                    To the maximum extent permitted by law, Luxora shall not be liable
                    for any indirect, incidental, special, consequential, or punitive
                    damages arising from or related to your use of our Platform,
                    including but not limited to loss of profits, data, or other
                    intangible losses.
                  </p>
                  <p>
                    Our total liability for any claim arising from or related to
                    these Terms or your use of the Platform shall not exceed the
                    amount you paid to Luxora in the 12 months preceding the claim.
                  </p>
                </div>
              </div>

              {/* Governing Law */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  8. Governing Law
                </h2>
                <p className="text-charcoal-300 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with
                  the laws of the State of Delaware, United States, without regard
                  to its conflict of law provisions. Any disputes arising from these
                  Terms shall be resolved through binding arbitration in accordance
                  with the rules of the American Arbitration Association.
                </p>
              </div>

              {/* Changes */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  9. Changes to These Terms
                </h2>
                <p className="text-charcoal-300 leading-relaxed">
                  We reserve the right to update or modify these Terms at any time.
                  Changes will be effective immediately upon posting to the Platform.
                  Your continued use of the Platform after any changes constitutes
                  your acceptance of the updated Terms. We encourage you to review
                  these Terms periodically.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6">
                <h2 className="font-heading text-xl font-bold text-charcoal-100 mb-3">
                  Questions About These Terms?
                </h2>
                <p className="text-charcoal-300 text-sm leading-relaxed">
                  If you have any questions about these Terms of Service, please
                  contact us at{" "}
                  <a
                    href="mailto:legal@luxora.com"
                    className="text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    legal@luxora.com
                  </a>{" "}
                  or visit our{" "}
                  <a
                    href="/contact"
                    className="text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    Contact
                  </a>{" "}
                  page.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
