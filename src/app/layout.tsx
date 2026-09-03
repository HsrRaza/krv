import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MainContentWrapper from "@/components/MainContentWrapper";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "KRV Builders & Developers | Structural Elegance & Precision",
  description:
    "Leading residential and commercial construction firm in Ramanagara with over 14 years of excellence in Vastu-compliant architectural planning, structural engineering, turnkey construction, and interior design.",
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
    <html lang="en" className={`${inter.variable} ${montserrat.variable} light`}>
      <body className="min-h-screen bg-stone-50 text-slate-900 font-sans flex flex-col selection:bg-amber-500 selection:text-white">
        <SmoothScrollProvider>
          <Navbar />
          <MainContentWrapper>{children}</MainContentWrapper>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
