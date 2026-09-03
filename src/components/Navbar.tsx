"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Phone, Menu, X, ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Work In Progress", href: "/work-in-progress" },
    { name: "Gallery", href: "/gallery" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-3"
          : "bg-stone-50/90 backdrop-blur-sm border-b border-slate-200/50 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-12 w-auto flex items-center justify-center overflow-hidden rounded-xl bg-white p-1 border border-slate-200 shadow-sm group-hover:scale-105 transition duration-300">
            <img src="/logo.png" alt="KRV Builders Logo" className="h-full w-auto object-contain max-h-10" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
              KRV BUILDERS
            </span>
            <span className="font-display font-bold text-[10px] text-amber-600 uppercase tracking-architectural">
              & Developers • Ramanagara
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-stone-100/70 p-1.5 rounded-full border border-slate-200/80 font-sans">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition duration-200 ${
                  isActive
                    ? "bg-amber-600 text-white shadow-sm font-bold"
                    : "text-slate-700 hover:text-amber-600 hover:bg-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5 font-sans">
          <a
            href="tel:+918123758878"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide text-slate-700 hover:text-slate-900 bg-stone-100 hover:bg-stone-200 border border-slate-200 transition"
          >
            <Phone className="w-3.5 h-3.5 text-amber-600" />
            <span>+91 8123758878</span>
          </a>

          <Link
            href="/contact"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20 transition"
          >
            <span>Enquire</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Admin Login Button */}
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide text-slate-700 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition shadow-sm"
            title="Admin Login Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 overflow-hidden shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-amber-50 hover:text-amber-600 transition flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                <a
                  href="tel:+918123758878"
                  className="w-full py-3 rounded-xl bg-stone-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>Call +91 8123758878</span>
                </a>
                <a
                  href="https://wa.me/918123758878"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageSquare className="w-4 h-4 fill-white/20" />
                  <span>WhatsApp Us</span>
                </a>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Admin Login Portal</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
