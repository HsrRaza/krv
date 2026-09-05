"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Phone, Mail, MapPin, ArrowRight, ShieldCheck, HardHat } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-16 flex items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 border border-slate-600 shadow-md ring-4 ring-white/5">
                <div className="absolute inset-1 rounded-lg border border-amber-100/80 pointer-events-none" />
                <img src="/logo.png" alt="KRV Builders Logo" className="relative h-full w-full object-contain max-h-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-white tracking-tight leading-tight">
                  KRV BUILDERS
                </span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  & Developers • Ramanagara
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Leading architectural, civil construction, and interior design firm in Ramanagara. Delivering 100% Vastu-compliant structures, RCC engineering, photorealistic 3D elevations, and turnkey commercial & residential builds.
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/20 w-fit">
              <HardHat className="w-4 h-4 text-amber-400" />
              <span>14+ Years of Proven Architectural Excellence</span>
            </div>
          </div>

          {/* Quick Sitemap */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Sitemap
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              <li>
                <Link href="/" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" /> Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" /> Our Services
                </Link>
              </li>
              <li>
                <Link href="/work-in-progress" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" /> Live Job Sites
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" /> Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" /> About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" /> Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Services List */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>Architectural Planning & Vastu</li>
              <li>Structural Design & RCC</li>
              <li>Turnkey Building Construction</li>
              <li>Photorealistic 3D Elevation</li>
              <li>Custom Interior Design</li>
              <li>Estimation & Evaluation</li>
              <li>Civil Consultancy</li>
              <li>Real Estate Solutions</li>
            </ul>
          </div>

          {/* Direct Contact Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Contact Info
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1st+Floor,+Above+Canara+Bank+ATM,+Moti+Nagar+Extension,+Ramanagara,+Karnataka+562159"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition"
                >
                  1st Floor, Above Canara Bank ATM, Moti Nagar Extension, Ramanagara, Karnataka 562159
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="flex flex-col font-semibold">
                  <a href="tel:+918123758878" className="hover:text-white transition">
                    +91 8123758878
                  </a>
                  <a href="tel:+918660256319" className="hover:text-white transition">
                    +91 8660256319
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href="mailto:krvbuildersndevelopers@gmail.com"
                  className="hover:text-white transition truncate font-medium"
                >
                  krvbuildersndevelopers@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Line & Legal Disclaimer */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} KRV Builders & Developers. All rights reserved. Registered Office: Ramanagara, Karnataka.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-amber-400 transition font-semibold">
              Admin Portal Sign In
            </Link>
            <span>•</span>
            <span>Quality • Transparency • Strength</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
