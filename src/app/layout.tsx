import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { portfolio } from "@/content/portfolio";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * No production domain is assumed. Set NEXT_PUBLIC_SITE_URL in the environment
 * (see .env.example) and absolute metadata URLs follow automatically.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: portfolio.meta.title,
  description: portfolio.meta.description,
  keywords: portfolio.meta.keywords,
  authors: [{ name: portfolio.profile.name }],
  creator: portfolio.profile.name,
  openGraph: {
    type: "website",
    title: portfolio.meta.title,
    description: portfolio.meta.description,
    siteName: portfolio.profile.name,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: portfolio.meta.title,
    description: portfolio.meta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0d0e",
  colorScheme: "dark",
};

/**
 * Props are written out explicitly rather than using Next's generated
 * `LayoutProps` global, which only exists after a build — `tsc --noEmit` has to
 * work on a fresh clone, which is exactly what CI does.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
