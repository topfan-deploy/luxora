import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  Settings,
  User,
} from "lucide-react";

const navLinks = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-charcoal-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* User Info */}
            <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-charcoal-700 flex items-center justify-center overflow-hidden border-2 border-gold-400/30">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gold-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-charcoal-100 font-semibold truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-sm text-charcoal-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block bg-charcoal-900 border border-charcoal-700 rounded-xl overflow-hidden">
              <ul className="divide-y divide-charcoal-700/50">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <AccountNavLink href={link.href} label={link.label}>
                      <link.icon className="h-5 w-5" />
                    </AccountNavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Navigation */}
            <nav className="lg:hidden bg-charcoal-900 border border-charcoal-700 rounded-xl overflow-hidden">
              <div className="flex overflow-x-auto scrollbar-hide">
                {navLinks.map((link) => (
                  <AccountNavLinkMobile
                    key={link.href}
                    href={link.href}
                    label={link.label}
                  >
                    <link.icon className="h-4 w-4" />
                  </AccountNavLinkMobile>
                ))}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

function AccountNavLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-5 py-3.5 text-charcoal-300 hover:text-gold-400 hover:bg-charcoal-800/50 transition-colors font-body text-sm group"
    >
      <span className="text-charcoal-400 group-hover:text-gold-400 transition-colors">
        {children}
      </span>
      {label}
    </Link>
  );
}

function AccountNavLinkMobile({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-3 text-charcoal-300 hover:text-gold-400 transition-colors font-body text-sm whitespace-nowrap border-b-2 border-transparent hover:border-gold-400"
    >
      {children}
      {label}
    </Link>
  );
}
