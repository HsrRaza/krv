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
        setInProgressProjects([]);
      }
    } catch (err) {
      console.error("Error fetching work in progress data:", err);
      setInProgressProjects([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen space-y-16 sm:space-y-20 pb-24 overflow-hidden bg-[#f4f1eb] text-slate-900">
      {/* HEADER HERO */}
      <section className="relative overflow-hidden bg-[#18211f] text-white border-b border-[#34413c]">
        <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(#d9b56d_1px,transparent_1px),linear-gradient(90deg,#d9b56d_1px,transparent_1px)] bg-size-[56px_56px]" />
        <div className="absolute -right-32 -top-40 h-96 w-96 rounded-full border border-amber-200/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10 grid lg:grid-cols-[1fr_260px] gap-10 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-5 max-w-4xl"
          >
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
              <HardHat className="w-4 h-4" />
              <span>Live Job Sites & Active Civil Execution</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[0.98]">
              Work in progress.<br />
              <span className="text-amber-300">Built in public.</span>
            </h1>
            <p className="text-[#c5cfca] text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
              Follow the active sites taking shape across Ramanagara, from structural execution to the final finish. Progress is updated directly by the KRV team.
            </p>
          </motion.div>
          <div className="border-l border-amber-200/25 pl-5 space-y-2">
            <div className="text-4xl font-extrabold text-white">{inProgressProjects.length.toString().padStart(2, "0")}</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#aab7b0]">Active sites</div>
            <div className="text-xs leading-relaxed text-[#aab7b0]">Live construction updates from our field team.</div>
          </div>
        </div>
      </section>

      {/* ACTIVE SITES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-5 border-b border-slate-300">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Active Job Sites ({inProgressProjects.length})
            </h2>
            <p className="text-xs text-slate-500 mt-1">Live execution phases & structural status</p>
          </div>
          <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-800 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {inProgressProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 group flex flex-col justify-between transition-all duration-500"
              >
                <div>
                  <div className="relative h-72 overflow-hidden bg-slate-900">
                    <img
                      src={getOptimizedImageUrl(project.img, 800)}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />

                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-white/95 text-slate-900 text-[10px] font-extrabold rounded-lg shadow uppercase tracking-architectural">
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
                    <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 uppercase tracking-architectural">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2 group-hover:text-amber-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{project.location}</span>
                    </p>

                    <div className="mt-4 p-4 rounded-xl bg-[#faf7ef] border border-amber-200/80 border-l-4 border-l-amber-500">
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
        <div className="rounded-2xl p-8 sm:p-10 bg-[#18211f] text-white border border-[#34413c] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
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
