"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Maximize2,
  X,
  Building2,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

type GalleryCategory =
  | "all"
  | "construction"
  | "elevation"
  | "interior"
  | "vastu";

interface ProjectItem {
  id: string;
  title: string;
  category: GalleryCategory;
  categoryName: string;
  location: string;
  img: string;
  desc: string;
  details: string[];
}

const projects: ProjectItem[] = [
  {
    id: "proj-1",
    title: "Modern Dual-Facade Villa",
    category: "elevation",
    categoryName: "3D Elevation & Facade",
    location: "Ramanagara Extension",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWUKq5374Y1tf4j4sejCM2nvRhgSub9YJxCkxh77qaft1gBmKIgSH5EYU6C5NnnsqWY2cLoU8ArNJNRjmdqetSOEO6jNjXsGM9-IjAJU5E-Azvu-f4R9Os6wl7rmIr4h4IPfYYm77sx9UTlz4SeOosJnwrDp9v5JdU-pZJTcYkfW0xblpk__XDpxEyYpdou5il72Z4hOiJ1oIxw1XjrYfe80Ho0_IphiJRn_gssxEArXyHSsrVzyzr0LZ7kb8q6Fs6ww",
    desc: "Contemporary duplex residential facade featuring composite wood paneling, warm exterior LED strip accents, and large Vastu-aligned window frames.",
    details: ["Plot Size: 40x60 ft", "Scope: 3D Elevation & Turnkey Civil Work", "Year: 2024"],
  },
  {
    id: "proj-2",
    title: "Reinforced Concrete Framing",
    category: "construction",
    categoryName: "Turnkey Building Construction",
    location: "Mysore Road Corridor",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNrsM8ChJLwQmUna28Tbcv8zQelGGI2dugVfBZRTTHoNk2WOLwlXILah9icOlJe0OtHwGe3DhgPTupu9WsyUgFu9ScdBytfAKfCANFOjnl0gregdGbZlXDQrf72MZrkfZs0smAouwqJamEdEsAu1HWQq5LrPbYNF9GwrIL6U8CMIeNewzxenaqWHHRRpXdG5gZjWGuAXB6H7z3Bff6aML4OiBmnYZvSFAF6KDZfhq7Amxov0rcR4pseg-669XRrBrcJQ",
    desc: "Structural skeleton execution for a G+3 commercial building utilizing high-tensile Fe-550 steel rebars and high-strength concrete mix.",
    details: ["Structure: G+3 Commercial", "Scope: RCC Skeleton & Civil Masonry", "Year: 2023"],
  },
  {
    id: "proj-3",
    title: "Open-Concept Modular Kitchen",
    category: "interior",
    categoryName: "Interior Design",
    location: "Indiranagar Villa",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5qttJWAJkJtAprcTFp7jkfiehSUDtwV68Vz7FQTHbakQDKLCNpMIXS8z0I2gBg496jQPrqz83btyCqHZH-_D8AJ9DI3CLmQgcisVFJFWvaxu6m7PO2MJCxvVcuCGN0cY0K_SUV3lm3qmr9FM3l40CBwbnrFbZsHGSG-z_fDRCjwUKEZ1zrcX3i6Mp6jdirFV-sshqQXCLI4AFJUSIn9oQ5nHB1RdtLo_BBx4DVjbO2d2-VhXnZiaMkgJZ9CRu7h48vg",
    desc: "Custom acrylic modular kitchen design with seamless soft-close drawers, island breakfast counter, and integrated quartz countertop.",
    details: ["Type: Modular Kitchen", "Materials: Acrylic & Quartz", "Year: 2024"],
  },
  {
    id: "proj-4",
    title: "Luxury Contemporary Residence",
    category: "construction",
    categoryName: "Turnkey Building Construction",
    location: "Kengeri Satellite Town",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    desc: "End-to-end turnkey construction of a 4BHK luxury independent home with stone cladding exterior and landscaped garden perimeter.",
    details: ["Plot Size: 50x80 ft", "Scope: Full Turnkey Key Handover", "Year: 2024"],
  },
  {
    id: "proj-5",
    title: "Vastu 2D & 3D Blueprint Plan",
    category: "vastu",
    categoryName: "Architectural & Vastu Plans",
    location: "Ramanagara City",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    desc: "Vastu-optimized floor layout for a 30x40 site maximizing natural light, East-facing entry, and optimal room geometry.",
    details: ["Plot Size: 30x40 ft", "Orientation: East Facing", "Scope: Vastu Plan & Sanction"],
  },
  {
    id: "proj-6",
    title: "Minimalist Master Bedroom Interior",
    category: "interior",
    categoryName: "Interior Design",
    location: "Vijayanagar Residence",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    desc: "Ergonomic master suite interior with ambient backlighting, floor-to-ceiling veneer wardrobe, and acoustic wooden paneling.",
    details: ["Type: Master Suite", "Scope: Complete Woodwork & Lighting", "Year: 2024"],
  },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>("all");
  const [activeModalItem, setActiveModalItem] = useState<ProjectItem | null>(null);

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

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
              <span>Craftsmanship Portfolio</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Our Construction & Design <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                Showcase
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-lg max-w-3xl font-normal mt-2 leading-relaxed">
              Explore our portfolio of completed independent homes, structural frameworks, 3D elevation renders, and bespoke interiors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FILTER TABS & GALLERY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {[
            { key: "all", label: "All Projects" },
            { key: "construction", label: "Building Construction" },
            { key: "elevation", label: "3D Elevations" },
            { key: "interior", label: "Interior Design" },
            { key: "vastu", label: "Vastu Plans" },
          ].map((tab) => {
            const isActive = selectedCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key as GalleryCategory)}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Items */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md hover:shadow-xl group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-900">
                    <img
                      src={project.img}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />

                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold rounded-full border border-slate-200 shadow-sm">
                        {project.categoryName}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveModalItem(project)}
                      className="absolute bottom-4 right-4 p-3 rounded-full bg-slate-900/90 text-white hover:bg-amber-500 hover:text-slate-950 transition shadow-lg opacity-90 hover:scale-110"
                      title="Expand View"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">📍 {project.location}</p>
                    <p className="text-slate-600 text-sm mt-3 leading-relaxed line-clamp-2">
                      {project.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                  <button
                    onClick={() => setActiveModalItem(project)}
                    className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
                  >
                    View Specifications & Specs
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setActiveModalItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-2xl my-8"
            >
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 bg-slate-950 min-h-[300px] lg:min-h-[450px] relative flex items-center justify-center">
                  <img
                    src={activeModalItem.img}
                    alt={activeModalItem.title}
                    className="w-full h-full object-cover max-h-[500px]"
                  />
                </div>
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      {activeModalItem.categoryName}
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
                      {activeModalItem.title}
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-1">📍 {activeModalItem.location}</p>
                    <p className="text-slate-600 text-sm mt-4 leading-relaxed">
                      {activeModalItem.desc}
                    </p>

                    <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
                      <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-2">
                        Project Highlights
                      </h4>
                      {activeModalItem.details.map((d) => (
                        <div key={d} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 flex flex-col gap-2">
                    <a
                      href={`https://wa.me/918123758878?text=${encodeURIComponent(
                        `Hi KRV Builders, I saw your ${activeModalItem.title} project and would like similar information.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-500 transition shadow-md"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Inquire About Similar Build
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
