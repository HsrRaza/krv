"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types/database";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import {
  Sparkles,
  Maximize2,
  X,
  Building2,
  CheckCircle2,
  MessageSquare,
  Loader2,
  MapPin,
  Tag,
  Compass,
} from "lucide-react";

type GalleryCategory = "all" | "3D Elevation" | "Plan" | "Interior Design";

interface DisplayProject {
  id: string;
  title: string;
  category: string;
  categoryName: string;
  location: string;
  img: string;
  galleryImages: string[];
  desc: string;
  details: string[];
  status: "in_progress" | "completed";
}

const fallbackProjects: DisplayProject[] = [
  {
    id: "fallback-1",
    title: "Modern Dual-Facade Villa",
    category: "3D Elevation",
    categoryName: "3D Elevation",
    location: "Ramanagara Extension",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
    desc: "Contemporary duplex residential facade featuring composite wood paneling, warm exterior LED strip accents, and large window frames.",
    details: ["Plot Size: 40x60 ft", "Type: 3D Elevation Design", "Year: 2024"],
    status: "completed",
  },
  {
    id: "fallback-2",
    title: "Vastu 2D & 3D Architectural Blueprint",
    category: "Plan",
    categoryName: "Plan",
    location: "Ramanagara City",
    img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [],
    desc: "Vastu-optimized layout plan for a 30x40 site maximizing natural light, East-facing main entry, and optimal structural geometry.",
    details: ["Plot Size: 30x40 ft", "Orientation: East Facing", "Scope: Vastu Plan & Sanction"],
    status: "completed",
  },
  {
    id: "fallback-3",
    title: "Open-Concept Modular Kitchen",
    category: "Interior Design",
    categoryName: "Interior Design",
    location: "Indiranagar Villa",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [],
    desc: "Custom acrylic modular kitchen design with seamless soft-close drawers, island breakfast counter, and integrated quartz countertop.",
    details: ["Type: Modular Kitchen", "Materials: Acrylic & Quartz", "Year: 2024"],
    status: "completed",
  },
  {
    id: "fallback-4",
    title: "Luxury Contemporary Residence Exterior",
    category: "3D Elevation",
    categoryName: "3D Elevation",
    location: "Kengeri Satellite Town",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [],
    desc: "Turnkey luxury independent home exterior featuring natural stone cladding and modern glass balcony railings.",
    details: ["Plot Size: 50x80 ft", "Scope: 3D Render & Execution", "Year: 2024"],
    status: "completed",
  },
  {
    id: "fallback-5",
    title: "Minimalist Master Suite Interior",
    category: "Interior Design",
    categoryName: "Interior Design",
    location: "Vijayanagar Residence",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [],
    desc: "Ergonomic master suite interior with ambient concealed backlighting, floor-to-ceiling veneer wardrobe, and acoustic wooden paneling.",
    details: ["Type: Master Suite", "Scope: Woodwork & Lighting", "Year: 2024"],
    status: "completed",
  },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>("all");
  const [projectsList, setProjectsList] = useState<DisplayProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModalItem, setActiveModalItem] = useState<DisplayProject | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchLiveGalleryProjects();
  }, []);

  const fetchLiveGalleryProjects = async () => {
    setLoading(true);
    try {
      // Exclude work in progress items (status === 'in_progress') so WIP data stays ONLY in /work-in-progress!
      const { data, error } = await (supabase.from("projects") as any)
        .select("*")
        .neq("status", "in_progress")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: DisplayProject[] = data.map((p: Project) => {
          let catKey = "3D Elevation";
          const catLower = (p.category || "").toLowerCase();
          if (catLower.includes("plan") || catLower.includes("blueprint") || catLower.includes("vastu")) {
            catKey = "Plan";
          } else if (catLower.includes("interior")) {
            catKey = "Interior Design";
          } else if (catLower.includes("elevation") || catLower.includes("3d")) {
            catKey = "3D Elevation";
          } else {
            catKey = p.category || "3D Elevation";
          }

          return {
            id: p.id,
            title: p.title,
            category: catKey,
            categoryName: p.category || catKey,
            location: p.location,
            img: p.cover_image,
            galleryImages: p.gallery_images || [],
            desc: p.description || "Architectural design showcase by KRV Builders.",
            details: [
              `Category: ${p.category}`,
              `Location: ${p.location}`,
            ],
            status: p.status,
          };
        });
        setProjectsList(mapped);
      } else {
        setProjectsList(fallbackProjects);
      }
    } catch (err) {
      console.error("Error fetching gallery items:", err);
      setProjectsList(fallbackProjects);
    }
    setLoading(false);
  };

  const filteredProjects = projectsList
    .filter((p) => p.status !== "in_progress")
    .filter((p) => {
      if (selectedCategory === "all") return true;
      const catLower = (p.category || "").toLowerCase();
      const targetLower = selectedCategory.toLowerCase();

      if (selectedCategory === "Plan") {
        return catLower.includes("plan") || catLower.includes("blueprint") || catLower.includes("vastu");
      }
      if (selectedCategory === "Interior Design") {
        return catLower.includes("interior");
      }
      if (selectedCategory === "3D Elevation") {
        return catLower.includes("elevation") || catLower.includes("3d") || (!catLower.includes("plan") && !catLower.includes("interior"));
      }
      return catLower.includes(targetLower);
    });

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
              <span>Admin Managed Showcase</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              3D Elevations, Plans & <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                Interior Design Gallery
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-lg max-w-3xl font-normal mt-2 leading-relaxed">
              Explore our curated portfolio of photorealistic 3D elevations, Vastu architectural floor plans, and bespoke luxury interior designs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY FILTER TABS & SHOWCASE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tabs: 3D Elevation, Plan, Interior Design */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {[
            { key: "all", label: "All Designs" },
            { key: "3D Elevation", label: "3D Elevation" },
            { key: "Plan", label: "Plans (2D/3D & Vastu)" },
            { key: "Interior Design", label: "Interior Design" },
          ].map((tab) => {
            const isActive = selectedCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key as GalleryCategory)}
                className={`px-5 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-lg scale-105"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            <span className="text-sm font-medium">Fetching gallery designs...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <div className="text-base font-bold text-slate-800">No Gallery Designs Found</div>
            <p className="text-xs text-slate-500 mt-1">Select another category or upload photos in the admin panel.</p>
          </div>
        ) : (
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
                        src={getOptimizedImageUrl(project.img, 800)}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />

                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="px-3.5 py-1 bg-amber-500 text-slate-950 text-xs font-extrabold rounded-full shadow-sm uppercase tracking-wider">
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
                      <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>{project.location}</span>
                      </p>
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
                      View High-Res Photo ({1 + (project.galleryImages?.length || 0)})
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
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
                <div className="lg:col-span-7 bg-slate-950 min-h-[300px] lg:min-h-[450px] relative flex flex-col justify-center p-4">
                  <img
                    src={getOptimizedImageUrl(activeModalItem.img, 1200)}
                    alt={activeModalItem.title}
                    className="w-full h-full object-contain max-h-[400px] rounded-2xl"
                  />
                  {activeModalItem.galleryImages.length > 0 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {activeModalItem.galleryImages.map((gUrl, idx) => (
                        <img
                          key={idx}
                          src={getOptimizedImageUrl(gUrl, 300)}
                          alt={`Gallery photo ${idx}`}
                          className="w-16 h-16 object-cover rounded-xl border border-slate-800 shrink-0 cursor-pointer hover:border-amber-500 transition"
                          onClick={() =>
                            setActiveModalItem({
                              ...activeModalItem,
                              img: gUrl,
                            })
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      {activeModalItem.categoryName}
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
                      {activeModalItem.title}
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{activeModalItem.location}</span>
                    </p>
                    <p className="text-slate-600 text-sm mt-4 leading-relaxed">
                      {activeModalItem.desc}
                    </p>

                    <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
                      <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-2">
                        Design Information
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
                        `Hi KRV Builders, I'm interested in your ${activeModalItem.categoryName} design "${activeModalItem.title}". Can you provide custom design pricing?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-500 transition shadow-md"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Inquire About This Design
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
