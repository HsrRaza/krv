import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MainContentWrapper from "@/components/MainContentWrapper";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

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
  title: "KRV Builders & Developers | Architectural Precision & Construction",
  description:
    "14+ years of quality construction, structural design, and Vastu-compliant architecture in Ramanagara.",
  keywords: [
    "KRV Builders",
    "Builders in Ramanagara",
    "Construction Company Ramanagara",
    "Vastu Architectural Planning",
    "Structural Design",
    "Turnkey Residential Construction",
    "3D Elevation Design",
  ],
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
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-stone-50 text-slate-900 font-sans flex flex-col selection:bg-amber-100 selection:text-amber-900 antialiased">
        <SmoothScrollProvider>
          <Navbar />
          <MainContentWrapper>{children}</MainContentWrapper>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
