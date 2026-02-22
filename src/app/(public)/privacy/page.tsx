import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Luxora",
  description:
    "Learn how Luxora collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
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
              Privacy <span className="gold-text">Policy</span>
            </h1>
            <p className="mt-4 text-charcoal-300 max-w-xl mx-auto">
              Your privacy matters to us. This policy outlines how we handle your
              personal data.
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
                  Luxora (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to
                  protecting your privacy. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you visit our
                  website and make purchases through our platform. Please read this
                  policy carefully. By using our services, you consent to the
                  practices described herein.
                </p>
              </div>

              {/* Data Collection */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  1. Information We Collect
                </h2>
                <div className="space-y-4 text-charcoal-300 leading-relaxed">
                  <div>
                    <h3 className="text-charcoal-100 font-semibold mb-2">
                      Personal Information
                    </h3>
                    <p>
                      When you create an account, place an order, or contact us, we may
                      collect the following personal information:
                    </p>
                    <ul className="mt-2 space-y-1.5 ml-4">
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                        Full name and contact details (email address, phone number)
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                        Billing and shipping addresses
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                        Payment information (processed securely through third-party providers)
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                        Order history and product preferences
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-charcoal-100 font-semibold mb-2">
                      Automatically Collected Information
                    </h3>
                    <p>
                      When you browse our site, we automatically collect certain
                      technical information including your IP address, browser type,
                      operating system, referring URLs, pages viewed, time spent on
                      pages, and other browsing behavior data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Usage */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  2. How We Use Your Information
                </h2>
                <div className="space-y-2 text-charcoal-300 leading-relaxed">
                  <p>We use the information we collect to:</p>
                  <ul className="space-y-1.5 ml-4">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Process and fulfill your orders, including shipping and payment processing
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Create and manage your account
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Send transactional communications (order confirmations, shipping updates)
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Send marketing communications (with your consent, which you can withdraw at any time)
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Improve our website, products, and customer experience
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Prevent fraud and ensure the security of our platform
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Comply with legal obligations
                    </li>
                  </ul>
                </div>
              </div>

              {/* Data Sharing */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  3. Information Sharing
                </h2>
                <div className="space-y-4 text-charcoal-300 leading-relaxed">
                  <p>
                    We do not sell your personal information. We may share your
                    information with the following third parties only as necessary:
                  </p>
                  <ul className="space-y-1.5 ml-4">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      <strong className="text-charcoal-200">Payment Processors:</strong>{" "}
                      Stripe, PayPal, M-Pesa, and MTN Mobile Money for secure transaction processing
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      <strong className="text-charcoal-200">Shipping Partners:</strong>{" "}
                      To fulfill and deliver your orders
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      <strong className="text-charcoal-200">Analytics Providers:</strong>{" "}
                      To help us understand how our website is used (data is anonymized)
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      <strong className="text-charcoal-200">Legal Authorities:</strong>{" "}
                      When required by law, subpoena, or to protect our rights
                    </li>
                  </ul>
                </div>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  4. Cookies & Tracking
                </h2>
                <div className="space-y-4 text-charcoal-300 leading-relaxed">
                  <p>
                    We use cookies and similar tracking technologies to enhance your
                    browsing experience. Types of cookies we use include:
                  </p>
                  <ul className="space-y-1.5 ml-4">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      <strong className="text-charcoal-200">Essential Cookies:</strong>{" "}
                      Required for the website to function (authentication, cart, security)
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      <strong className="text-charcoal-200">Analytics Cookies:</strong>{" "}
                      Help us understand site usage and improve performance
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      <strong className="text-charcoal-200">Marketing Cookies:</strong>{" "}
                      Used to deliver relevant advertising (only with your consent)
                    </li>
                  </ul>
                  <p>
                    You can manage your cookie preferences through your browser
                    settings. Disabling certain cookies may affect website functionality.
                  </p>
                </div>
              </div>

              {/* Security */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  5. Data Security
                </h2>
                <div className="space-y-4 text-charcoal-300 leading-relaxed">
                  <p>
                    We implement robust security measures to protect your personal
                    information, including:
                  </p>
                  <ul className="space-y-1.5 ml-4">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      SSL/TLS encryption for all data transmissions
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      PCI-DSS compliant payment processing
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Regular security audits and vulnerability assessments
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Secure password hashing with industry-standard algorithms
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      Limited access to personal data on a need-to-know basis
                    </li>
                  </ul>
                  <p>
                    While we take extensive measures to protect your data, no
                    method of transmission over the internet is 100% secure. We
                    encourage you to use strong, unique passwords and keep your
                    account credentials confidential.
                  </p>
                </div>
              </div>

              {/* User Rights */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  6. Your Rights
                </h2>
                <div className="space-y-4 text-charcoal-300 leading-relaxed">
                  <p>
                    Depending on your jurisdiction, you may have the following rights
                    regarding your personal data:
                  </p>
                  <ul className="space-y-1.5 ml-4">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      <strong className="text-charcoal-200">Right of Access:</strong>{" "}
                      Request a copy of the personal data we hold about you
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      <strong className="text-charcoal-200">Right to Rectification:</strong>{" "}
                      Request correction of inaccurate or incomplete data
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      <strong className="text-charcoal-200">Right to Erasure:</strong>{" "}
                      Request deletion of your personal data (subject to legal obligations)
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      <strong className="text-charcoal-200">Right to Portability:</strong>{" "}
                      Request your data in a structured, machine-readable format
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      <strong className="text-charcoal-200">Right to Object:</strong>{" "}
                      Object to processing of your data for marketing purposes
                    </li>
                  </ul>
                  <p>
                    To exercise any of these rights, please contact us at{" "}
                    <a
                      href="mailto:privacy@luxora.com"
                      className="text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      privacy@luxora.com
                    </a>
                    . We will respond to your request within 30 days.
                  </p>
                </div>
              </div>

              {/* Changes */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal-100 mb-4">
                  7. Changes to This Policy
                </h2>
                <p className="text-charcoal-300 leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices or legal requirements. We will notify
                  you of any material changes by posting the updated policy on this
                  page and updating the &ldquo;Last updated&rdquo; date. We encourage you
                  to review this policy periodically.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6">
                <h2 className="font-heading text-xl font-bold text-charcoal-100 mb-3">
                  Questions About This Policy?
                </h2>
                <p className="text-charcoal-300 text-sm leading-relaxed">
                  If you have any questions or concerns about this Privacy Policy
                  or our data practices, please contact us at{" "}
                  <a
                    href="mailto:privacy@luxora.com"
                    className="text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    privacy@luxora.com
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
