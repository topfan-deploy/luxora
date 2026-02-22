import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luxora | Premium Lifestyle Store",
  description:
    "Discover curated premium products across beauty, wellness, tech, fitness, and more. Luxora is your premium multi-category store for an elevated lifestyle.",
  keywords: [
    "premium",
    "lifestyle",
    "beauty",
    "wellness",
    "tech",
    "fitness",
    "eco-friendly",
    "fashion",
    "smart home",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${inter.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
