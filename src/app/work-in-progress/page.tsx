"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types/database";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import {
  HardHat,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Maximize2,
  X,
  MessageSquare,
  Loader2,
  Building2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface DisplayProgressProject {
  id: string;
  title: string;
  category: string;
  location: string;
  img: string;
  galleryImages: string[];
  currentPhase: string;
  desc: string;
}

const fallbackInProgress: DisplayProgressProject[] = [
  {
    id: "wip-1",
    title: "Luxury Duplex Villa Construction",
    category: "Turnkey Residential",
    location: "Ramanagara Extension, Plot #42",
    img: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [],
    currentPhase: "Brickwork, Lintels & Slab Casting",
    desc: "Turnkey construction of a 4BHK duplex villa spanning 3,200 sq ft. High-grade Fe-550 steel reinforcement and solid concrete blocks.",
  },
  {
    id: "wip-2",
    title: "G+3 Commercial Complex Framing",
    category: "Commercial Civil Structure",
    location: "Mysore Road Highway Junction",
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [],
    currentPhase: "RCC Column & Beam Structure",
    desc: "Commercial complex with underground parking raft foundation and high load-bearing column framework.",
  },
  {
    id: "wip-3",
    title: "Vastu Residential Independent House",
    category: "Vastu Turnkey Build",
    location: "Kengeri Satellite Town",
    img: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [],
    currentPhase: "Plumbing, Concealed Electrical & Plastering",
    desc: "East-facing 30x40 independent home featuring Vastu-compliant layout, double-charge vitrified flooring foundation.",
  },
];

export default function WorkInProgressPage() {
  const [inProgressProjects, setInProgressProjects] = useState<DisplayProgressProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModalItem, setActiveModalItem] = useState<DisplayProgressProject | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchInProgressData();
  }, []);

  const fetchInProgressData = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase.from("projects") as any)
        .select("*")
        .eq("status", "in_progress")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: DisplayProgressProject[] = data.map((p: Project) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          location: p.location,
          img: p.cover_image,
          galleryImages: p.gallery_images || [],
          currentPhase: p.current_phase || "Structural Civil Construction",
          desc: p.description || "Active job site under execution by KRV Builders engineers.",
        }));
        setInProgressProjects(mapped);
      } else {
        setInProgressProjects(fallbackInProgress);
      }
    } catch (err) {
      console.error("Error fetching work in progress data:", err);
      setInProgressProjects(fallbackInProgress);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20 overflow-hidden bg-stone-50 text-slate-900">
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
              <HardHat className="w-4 h-4" />
              <span>Live Job Sites & Active Civil Execution</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Work In Progress — <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                Active Site Engineering
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-lg max-w-3xl font-normal mt-2 leading-relaxed">
              Track real-time construction progress across our active residential and commercial sites in Ramanagara. Updated directly from our admin panel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ACTIVE SITES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Active Job Sites ({inProgressProjects.length})
            </h2>
            <p className="text-xs text-slate-500 mt-1">Live execution phases & structural status</p>
          </div>
          <span className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live On-Site Activity
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            <span className="text-sm font-medium">Fetching active job sites from admin panel...</span>
          </div>
        ) : inProgressProjects.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <div className="text-base font-bold text-slate-800">No Active Sites at Present</div>
            <p className="text-xs text-slate-500 mt-1">Check back soon or contact us to start your construction.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {inProgressProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-slate-900">
                    <img
                      src={getOptimizedImageUrl(project.img, 800)}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />

                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-extrabold rounded-full shadow">
                        Active Site
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveModalItem(project)}
                      className="absolute bottom-4 right-4 p-3 rounded-full bg-slate-900/90 text-white hover:bg-amber-500 hover:text-slate-950 transition shadow-lg opacity-90 hover:scale-110"
                      title="Inspect Site Photos"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6">
                    <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2 group-hover:text-amber-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{project.location}</span>
                    </p>

                    <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                      <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Current Execution Phase:
                      </div>
                      <div className="text-xs font-extrabold text-slate-900">
                        {project.currentPhase}
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                      {project.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                  <a
                    href={`https://wa.me/918123758878?text=${encodeURIComponent(
                      `Hi KRV Builders, I'm interested in visiting your active site "${project.title}" located at ${project.location}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-slate-950 transition shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Request Site Inspection
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* QUALITY ASSURANCE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-10 bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">KRV On-Site Engineering Standards</h3>
              <p className="text-slate-300 text-sm mt-1">Every active job site undergoes weekly concrete cube compression tests, rebar spacing checks, and Vastu alignment audits.</p>
            </div>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition shadow-md shrink-0 flex items-center gap-2"
          >
            <span>Book Site Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
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
                          alt={`Site photo ${idx}`}
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
                      Active Job Site
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
                      {activeModalItem.title}
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{activeModalItem.location}</span>
                    </p>

                    <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                      <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                        Current Execution Phase:
                      </div>
                      <div className="text-sm font-extrabold text-slate-900">
                        {activeModalItem.currentPhase}
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm mt-4 leading-relaxed">
                      {activeModalItem.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 flex flex-col gap-2">
                    <a
                      href={`https://wa.me/918123758878?text=${encodeURIComponent(
                        `Hi KRV Builders, I'm interested in visiting your active site "${activeModalItem.title}" at ${activeModalItem.location}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-500 transition shadow-md"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Inquire / Visit Site
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
