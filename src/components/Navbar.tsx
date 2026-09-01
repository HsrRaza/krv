"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Phone, Menu, X, ArrowRight, MessageSquare } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-3"
          : "bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight font-sans text-slate-900">
              KRV <span className="text-amber-600">BUILDERS</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">
              & Developers • Ramanagara
            </span>
          </div>
        </Link>

        {/* Desktop / Tablet Navigation */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-slate-100/90 border border-slate-200/80">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-white font-bold"
                    : "text-slate-700 hover:text-amber-600"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded-full bg-amber-600 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop / Laptop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="https://wa.me/918123758878"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full hover:bg-emerald-100 transition shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-emerald-600/20 text-emerald-600" />
            WhatsApp
          </a>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-full shadow-md shadow-amber-600/20 hover:scale-105 transition"
          >
            <span>Enquire Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
          className="md:hidden p-2.5 rounded-xl border bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/98 border-b border-slate-200/90 backdrop-blur-xl overflow-hidden px-4 pt-3 pb-6 shadow-xl"
          >
            <div className="flex flex-col gap-2 mt-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                      isActive
                        ? "bg-amber-600 text-white font-bold"
                        : "text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
                <a
                  href="tel:+918123758878"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-900 font-bold text-sm border border-slate-200"
                >
                  <Phone className="w-4 h-4 text-amber-600" />
                  +91 8123758878
                </a>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 text-white font-bold text-sm shadow-md"
                >
                  Enquire Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
