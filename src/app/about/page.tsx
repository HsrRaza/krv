"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  ShieldCheck,
  Compass,
  FileCheck,
  HeartHandshake,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-16 sm:space-y-20 pb-20 overflow-hidden bg-slate-50 text-slate-900">
      {/* PAGE HEADER HERO */}
      <section className="relative overflow-hidden bg-[#18211f] text-white border-b border-[#34413c]">
        <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(#d9b56d_1px,transparent_1px),linear-gradient(90deg,#d9b56d_1px,transparent_1px)] bg-size-[56px_56px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-5 max-w-4xl"
          >
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Story & Legacy</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[0.98]">
              Building with Vision, Precision & <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                Enduring Trust
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-lg max-w-3xl font-normal mt-2 leading-relaxed">
              For over 14 years, KRV Builders & Developers has been a trusted benchmark in residential and commercial construction in Ramanagara and Karnataka.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOUNDATION & PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 flex flex-col gap-5"
          >
            <span className="text-xs uppercase tracking-widest font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 w-fit">
              Our Foundation & Philosophy
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Bridging Construction Strength with Aesthetic Elegance
            </h2>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              We bridge the gap between raw construction strength and premium residential finishes, ensuring every project is a masterpiece of architectural precision.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Our philosophy is rooted in harmony—balancing modern aesthetics with time-tested Vastu principles. We believe that a home is more than just a structure; it's an enduring sanctuary built on high-trust craftsmanship and operational resilience.
            </p>

            <blockquote className="p-5 rounded-2xl bg-amber-50 border-l-4 border-amber-500 text-amber-950 italic text-sm sm:text-base leading-relaxed font-medium">
              "Every blueprint we create is a promise of quality, delivered with meticulous attention to detail and a commitment to our clients' vision."
            </blockquote>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative"
          >
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-y8VMZ2iBz5xce3owDq22ywYkB-E3MrM122ti6j760pBpU3Sb3sGAdlRzTc0M7eNW5KKXjSP9M30poRSQPV8i0GGIl0z_3tIH3wtV4JmPzZQrkSPMH56RkyYVX1H7cOMXzZy4jUHVxGB2P8Je2Y38DWCZeBBKjvEVngh5A2vaU5FoffNcS41FzVG9BZIhXR7hsRDDYidMZzQuxHPnaVgWGVwkNdIsWCBmCZox3KQzbrcxbj1cEUunUn3n3pGp6w2OEw"
                alt="KRV Construction Site Overview"
                className="w-full h-[360px] sm:h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-amber-600" />
                  <div>
                    <div className="text-slate-900 font-extrabold text-base">14+ Years</div>
                    <div className="text-xs text-slate-600 font-medium">Of Engineering Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS METRICS GRID */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            {[
              { val: "14+", label: "Years Experience" },
              { val: "100%", label: "Vastu-Compliant Designs" },
              { val: "360°", label: "Multi-Domain Solutions" },
              { val: "0", label: "Safety Compromises" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm"
              >
                <div className="text-2xl sm:text-4xl font-extrabold text-amber-600 mb-1">{stat.val}</div>
                <div className="text-xs sm:text-sm text-slate-600 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            What Drives Us
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Our Core Values
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            The principles that guide our everyday decisions on site and with our clients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Integrity",
              icon: HeartHandshake,
              desc: "We build with honesty, ensuring transparent communication, fixed cost estimates, and ethical practices in every phase.",
            },
            {
              title: "Safety & Standards",
              icon: ShieldCheck,
              desc: "Uncompromising commitment to structural integrity, site worker safety, and premium material selection.",
            },
            {
              title: "Vastu Harmony",
              icon: Compass,
              desc: "Infusing traditional Indian Vastu principles into contemporary spatial layouts for positive living energy.",
            },
            {
              title: "Operational Mastery",
              icon: FileCheck,
              desc: "Strict compliance with municipal approvals, IS-code structural framing, and on-time project handover.",
            },
          ].map((val) => (
            <motion.div
              key={val.title}
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:border-amber-500/50 transition flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <val.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{val.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-slate-900 text-white text-center flex flex-col items-center gap-6 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Turn Your Dream Property into Reality?</h2>
          <p className="text-slate-300 max-w-xl text-sm sm:text-base">
            Consult with our structural engineering team to get started on your architectural plan or site valuation.
          </p>
          <Link
            href="/contact"
            className="px-8 py-4 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition shadow-lg flex items-center gap-2 text-sm sm:text-base"
          >
            <span>Get Free Quote & Blueprint Review</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
