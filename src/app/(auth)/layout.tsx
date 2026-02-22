import Link from "next/link";
import { Crown } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <Crown className="h-8 w-8 text-gold-400 group-hover:text-gold-300 transition-colors" />
            <span className="text-2xl font-heading font-bold text-charcoal-100 tracking-wide">
              LUXORA
            </span>
          </Link>
        </div>

        <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl p-8 shadow-2xl shadow-black/20">
          {children}
        </div>

        <p className="mt-8 text-center text-charcoal-400 text-sm">
          &copy; {new Date().getFullYear()} Luxora. All rights reserved.
        </p>
      </div>
    </div>
  );
}
