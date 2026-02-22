import Link from "next/link";
import { Crown, ShieldCheck } from "lucide-react";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col">
      {/* Minimal Checkout Header */}
      <header className="border-b border-charcoal-700 bg-charcoal-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <Crown className="h-7 w-7 text-gold-400 group-hover:text-gold-300 transition-colors" />
            <span className="text-xl font-heading font-bold text-charcoal-100 tracking-wide">
              LUXORA
            </span>
          </Link>

          <div className="flex items-center gap-2 text-charcoal-300 text-sm">
            <ShieldCheck className="h-4 w-4 text-green-400" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-charcoal-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-charcoal-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Luxora. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-charcoal-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-charcoal-200 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-charcoal-200 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
