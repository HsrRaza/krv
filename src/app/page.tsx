"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  ShieldCheck,
  Award,
  ArrowRight,
  MessageSquare,
  Compass,
  Ruler,
  Layers,
  ChevronRight,
  HardHat,
  Sparkles,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20 overflow-hidden bg-stone-50 text-slate-900">
      {/* LIGHT HERO SECTION WITH TRANSPARENT BACKGROUND IMAGE */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-stone-50">
        {/* Full Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')`,
          }}
        />

        {/* Soft Light Overlay for Pristine Readability without dark theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-50/95 via-stone-50/85 to-stone-50/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-transparent to-stone-50/30" />

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Headline & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 flex flex-col gap-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200/90 text-amber-800 text-xs font-bold tracking-wider uppercase backdrop-blur-md w-fit shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>14+ Years of Engineering Excellence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Building Dreams with <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800">
                Precision, Strength & Trust.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-medium">
              We transform blueprints into premium residential and commercial landmarks across Ramanagara and Karnataka. Expert structural craftsmanship meeting modern architectural minimalism.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-amber-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-amber-600/30 hover:bg-amber-700 hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <a
                href="https://wa.me/918123758878"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-sm sm:text-base border border-emerald-200 hover:bg-emerald-100 transition-all shadow-sm backdrop-blur-md"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 fill-emerald-600/20 text-emerald-600" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Stat Bar */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-slate-200/90 mt-2 max-w-xl">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">14+</span>
                <span className="text-xs text-slate-600 font-semibold">Years Experience</span>
              </div>
              <div className="flex flex-col border-l border-slate-200 pl-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">360°</span>
                <span className="text-xs text-slate-600 font-semibold">Domain Solutions</span>
              </div>
              <div className="flex flex-col border-l border-slate-200 pl-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">100%</span>
                <span className="text-xs text-slate-600 font-semibold">Vastu Compliant</span>
              </div>
            </div>
          </motion.div>

          {/* Right Floating Light Project Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4 hidden lg:block"
          >
            <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-xl text-slate-900 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Ramanagara Flagship Villa</h3>
                  <p className="text-xs text-slate-500 font-medium">Vastu-Aligned Construction</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Featured turnkey residential project executed with RCC framing, stone cladding, and custom interiors.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Completed On Time
                </span>
                <Link
                  href="/gallery"
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOUR PILLARS OF EXCELLENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col items-center text-center gap-3 mb-12"
        >
          <span className="text-xs uppercase tracking-widest font-bold text-amber-800 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
            Our Foundation
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Four Pillars of Excellence
          </h2>
          <p className="text-slate-600 max-w-2xl text-sm sm:text-base">
            Every structure we build rests on unwavering standards of integrity, resilience, and operational mastery.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              icon: ShieldCheck,
              title: "Reputation & Trust",
              desc: "Built on transparency, fixed timelines, and long-lasting client relationships in Karnataka.",
            },
            {
              icon: HardHat,
              title: "Operational Resilience",
              desc: "Robust project execution with zero compromise on safety or material quality.",
            },
            {
              icon: Layers,
              title: "Comprehensive Portfolio",
              desc: "From luxurious independent villas to structural skeletons and turnkey interiors.",
            },
            {
              icon: Award,
              title: "Compliance Discipline",
              desc: "Strict adherence to IS-code standards, structural safety, and municipal approvals.",
            },
          ].map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md hover:border-amber-500/40 flex flex-col gap-4 group transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                <pillar.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                {pillar.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CORE SERVICES PREVIEW */}
      <section className="bg-white border-y border-slate-200/80 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                What We Offer
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                End-to-End Construction Solutions
              </h2>
            </div>
            <Link
              href="/services"
              className="flex items-center gap-2 text-amber-600 font-bold hover:text-amber-700 transition text-sm group"
            >
              <span>Explore All Services</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Architectural Planning & Vastu",
                desc: "2D/3D functional floor plans designed strictly in harmony with ancient Vastu Shastra for optimal light and airflow.",
                icon: Compass,
                tag: "Vastu Aligned",
              },
              {
                title: "Structural Engineering & RCC",
                desc: "Seismic-resistant load bearing calculations, RCC column framing, and heavy foundation engineering.",
                icon: Ruler,
                tag: "IS-Code Standard",
              },
              {
                title: "Turnkey Building Construction",
                desc: "Complete end-to-end execution from soil excavation to final paint coat and key handover.",
                icon: Building2,
                tag: "Turnkey Execution",
              },
            ].map((service) => (
              <motion.div
                key={service.title}
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-2xl bg-stone-50 border border-slate-200/80 flex flex-col justify-between gap-6 relative overflow-hidden group shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                    {service.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{service.desc}</p>
                </div>
                <Link
                  href="/services"
                  className="flex items-center gap-2 text-xs font-bold text-amber-600 group-hover:text-amber-700"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Our Work
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Featured Construction Gallery
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            A curated showcase of precision engineering, modern facades, and bespoke interiors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              title: "Modern Dual-Facade Villa",
              location: "Bangalore North",
              category: "3D Elevations & Construction",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWUKq5374Y1tf4j4sejCM2nvRhgSub9YJxCkxh77qaft1gBmKIgSH5EYU6C5NnnsqWY2cLoU8ArNJNRjmdqetSOEO6jNjXsGM9-IjAJU5E-Azvu-f4R9Os6wl7rmIr4h4IPfYYm77sx9UTlz4SeOosJnwrDp9v5JdU-pZJTcYkfW0xblpk__XDpxEyYpdou5il72Z4hOiJ1oIxw1XjrYfe80Ho0_IphiJRn_gssxEArXyHSsrVzyzr0LZ7kb8q6Fs6ww",
            },
            {
              title: "Reinforced Concrete Framework",
              location: "Mysore Road Project",
              category: "Structural Skeleton",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNrsM8ChJLwQmUna28Tbcv8zQelGGI2dugVfBZRTTHoNk2WOLwlXILah9icOlJe0OtHwGe3DhgPTupu9WsyUgFu9ScdBytfAKfCANFOjnl0gregdGbZlXDQrf72MZrkfZs0smAouwqJamEdEsAu1HWQq5LrPbYNF9GwrIL6U8CMIeNewzxenaqWHHRRpXdG5gZjWGuAXB6H7z3Bff6aML4OiBmnYZvSFAF6KDZfhq7Amxov0rcR4pseg-669XRrBrcJQ",
            },
            {
              title: "Open-Concept Modular Kitchen",
              location: "Indiranagar Residence",
              category: "Interior Design",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5qttJWAJkJtAprcTFp7jkfiehSUDtwV68Vz7FQTHbakQDKLCNpMIXS8z0I2gBg496jQPrqz83btyCqHZH-_D8AJ9DI3CLmQgcisVFJFWvaxu6m7PO2MJCxvVcuCGN0cY0K_SUV3lm3qmr9FM3l40CBwbnrFbZsHGSG-z_fDRCjwUKEZ1zrcX3i6Mp6jdirFV-sshqQXCLI4AFJUSIn9oQ5nHB1RdtLo_BBx4DVjbO2d2-VhXnZiaMkgJZ9CRu7h48vg",
            },
          ].map((project) => (
            <motion.div
              key={project.title}
              whileHover={{ y: -6 }}
              className="rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:shadow-md group flex flex-col transition-all"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={project.img}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold rounded-full border border-slate-200 shadow-sm">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-medium">
                    <span>📍</span> {project.location}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/gallery"
                    className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all shadow-md text-sm"
          >
            <span>View Full Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Ready to Build Your Dream Property?
              </h2>
              <p className="text-white/90 font-medium mt-2 max-w-xl text-sm sm:text-base">
                Get a free consultation and customized Vastu layout plan from our engineering team in Ramanagara.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-7 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-lg"
              >
                Schedule Consultation
              </Link>
              <a
                href="tel:+918123758878"
                className="px-6 py-3.5 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-xl font-bold text-sm hover:bg-white/30 transition"
              >
                Call: +91 8123758878
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
