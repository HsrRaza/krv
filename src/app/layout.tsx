import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MainContentWrapper from "@/components/MainContentWrapper";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { createPageMetadata, getLocalBusinessJsonLd, serializeJsonLd, siteName, siteUrl } from "@/lib/seo";

// Primary Display Font: Architectural, geometric, structural authority
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["600", "700", "800"],
  display: "swap",
  preload: true,
});

// Secondary Interface & Body Font: Ultra-legible neutral workhorse
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  ...createPageMetadata("home"),
  metadataBase: new URL(siteUrl),
  title: {
    default: "Builders in Ramanagara | KRV Builders & Developers",
    template: `%s | ${siteName}`,
  },
  applicationName: siteName,
  creator: siteName,
  publisher: siteName,
  authors: [{ name: siteName }],
  keywords: [
    "builders in Ramanagara",
    "construction company in Ramanagara",
    "Vastu house plan designers near me",
    "building contractors Ramanagara",
    "architectural structural design Ramanagara",
    "turnkey construction Karnataka",
  ],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessJsonLd = getLocalBusinessJsonLd();

  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-stone-50 text-slate-900 font-sans flex flex-col selection:bg-amber-100 selection:text-amber-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(localBusinessJsonLd) }}
        />
        <SmoothScrollProvider>
          <Navbar />
          <MainContentWrapper>{children}</MainContentWrapper>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
