"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass,
  Ruler,
  Paintbrush,
  Eye,
  Building2,
  Calculator,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

const servicesList = [
  {
    id: "vastu",
    title: "Architectural Planning with Vastu",
    icon: Compass,
    badge: "Vastu Shastra",
    desc: "Functional, aesthetic 2D/3D floor layouts designed strictly in harmony with ancient Vastu Shastra principles for natural light and structural symmetry.",
    features: [
      "Vastu-aligned room zoning & entry orientations",
      "Natural ventilation & daylight optimization",
      "Local municipal sanction drawings & layout approvals",
      "Detailed 2D floor plans with structural grid markers",
    ],
  },
  {
    id: "structural",
    title: "Structural Engineering & RCC Design",
    icon: Ruler,
    badge: "Seismic Safety",
    desc: "Robust engineering blueprints and load-bearing calculations ensuring seismic resistance, structural integrity, and generational durability.",
    features: [
      "Foundation engineering & soil load analysis",
      "RCC column, beam, & steel framing details",
      "IS-code compliant structural calculation reports",
      "On-site rebar inspection & quality audits",
    ],
  },
  {
    id: "interior",
    title: "Bespoke Interior Design",
    icon: Paintbrush,
    badge: "Modern Aesthetics",
    desc: "Modern, ergonomic residential and commercial interior spaces crafted with premium materials, custom woodwork, and ergonomic lighting.",
    features: [
      "Modular kitchen planning with German hardware",
      "False ceiling designs & concealed LED lighting",
      "Custom wardrobe & furniture fabrication",
      "Space optimization for compact & luxury layouts",
    ],
  },
  {
    id: "elevation",
    title: "Photorealistic 3D Elevation",
    icon: Eye,
    badge: "3D Visualization",
    desc: "Photorealistic 3D front and exterior elevations visualizing textures, stone cladding, color schemes, and lighting before laying a single brick.",
    features: [
      "Day and night lighting render options",
      "Material & finish texture matching",
      "360-degree architectural walkthrough videos",
      "Facade enhancement for existing structures",
    ],
  },
  {
    id: "construction",
    title: "Turnkey Building Construction",
    icon: Building2,
    badge: "Full Execution",
    desc: "End-to-end site execution from ground excavation, RCC civil structure, brickwork, plumbing, electrical, to final turnkey key handover.",
    features: [
      "A-grade material sourcing (Tata Steel, UltraTech)",
      "Dedicated site engineers & daily progress updates",
      "Fixed timeline guarantee with zero cost overruns",
      "Post-construction structural warranty",
    ],
  },
  {
    id: "estimation",
    title: "Estimation, Costing & Consultancy",
    icon: Calculator,
    badge: "Financial Transparency",
    desc: "Precise Bill of Quantities (BOQ), material estimation, and project budgeting to keep your construction financially transparent.",
    features: [
      "Itemized BOQ with stage-wise cost breakdown",
      "Material quality & brand specification guides",
      "Bank loan estimation certificates & sanction assistance",
      "Renovation & structural health audits",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-16 sm:space-y-20 pb-20 overflow-hidden bg-slate-50 text-slate-900">
      {/* HEADER HERO */}
      <section className="relative pt-12 pb-16 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Spectrum Solutions</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              End-to-End Engineering & <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                Architectural Services
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-lg max-w-3xl font-normal mt-2 leading-relaxed">
              From Vastu-compliant blueprints and structural analysis to full turnkey construction and bespoke interiors in Ramanagara.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {servicesList.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-500/50 flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {service.badge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {service.desc}
                </p>

                {/* Features checklist */}
                <ul className="space-y-2.5 border-t border-slate-100 pt-6 mb-8">
                  {service.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-md"
              >
                <span>Quick Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CUSTOM PACKAGE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-10 bg-white border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Need a customized service package or custom floor plan consultation?</h3>
              <p className="text-slate-600 text-sm mt-1">Our engineering team offers tailored packages based on plot dimensions (30x40, 40x60, duplex, commercial).</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href="https://wa.me/918123758878"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-6 py-3.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-100 transition shadow-sm"
            >
              <MessageSquare className="w-4 h-4 fill-emerald-600/20 text-emerald-600" />
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="flex-1 md:flex-none px-6 py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm text-center hover:bg-amber-400 transition shadow-md"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
