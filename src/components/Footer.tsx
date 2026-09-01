import Link from "next/link";
import { Building2, Phone, Mail, MapPin, Clock, MessageSquare, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Company Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
                <Building2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  KRV <span className="text-amber-500">BUILDERS</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                  & Developers • Ramanagara
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed mt-1">
              Building dreams with precision, structural strength, and trust for over 14 years in Ramanagara and surrounding regions.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://wa.me/918123758878"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 rounded-lg hover:bg-emerald-900/60 transition"
              >
                <MessageSquare className="w-4 h-4 fill-emerald-400/20" />
                WhatsApp Direct
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400 mt-1">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Our Services", href: "/services" },
                { name: "Project Gallery", href: "/gallery" },
                { name: "Contact & Enquiry", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Services */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Our Specializations
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-400 mt-1">
              <li>• Vastu-Compliant Architectural Planning</li>
              <li>• Structural Engineering & RCC Framing</li>
              <li>• Turnkey Building Construction</li>
              <li>• Premium Interior Design & Kitchens</li>
              <li>• Photorealistic 3D Elevation</li>
              <li>• Estimation & Municipal Sanctioning</li>
            </ul>
          </div>

          {/* Contact Metadata */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Head Office
            </h4>
            <div className="flex flex-col gap-3 text-sm text-slate-400 mt-1">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>#1/4, 1st Floor, Above Canara Bank ATM, Extension Mohalla, Ramanagara - 562159, Karnataka.</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="tel:+918123758878" className="hover:text-white transition">
                  +91 8123758878 / 8660256319
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="mailto:krvbuildersndevelopers@gmail.com" className="hover:text-white transition truncate">
                  krvbuildersndevelopers@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Mon - Fri: 9am - 8pm (Sat-Sun Appt)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} KRV Builders & Developers. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Structural Elegance & Precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
