"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { Project } from "@/types/database";
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
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Eye,
  X,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  DollarSign,
  Maximize2,
  ExternalLink,
} from "lucide-react";

// Fallback initial projects if database is fresh
const DEMO_PROJECTS: Project[] = [
  {
    id: "demo-1",
    title: "Vastu Compliant G+2 Luxury Residence",
    status: "in_progress",
    category: "Construction",
    location: "Ramanagara Extension",
    current_phase: "Plastering & Electrical Concealing",
    cover_image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Premium 4BHK residence designed with 100% Vastu compliance and custom RCC framework.",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "Commercial Retail & Office Complex",
    status: "in_progress",
    category: "Construction",
    location: "BM Road, Ramanagara",
    current_phase: "Brickwork, Lintels & Slab Casting",
    cover_image:
      "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Modern commercial multi-story complex featuring glass facade and underground parking.",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-3",
    title: "Modern Duplex Villa 3D Elevation",
    status: "completed",
    category: "3D Elevations",
    location: "Channapatna Road",
    current_phase: null,
    cover_image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Contemporary 3D elevation rendering with wooden louvers and exterior LED highlights.",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-4",
    title: "Teakwood & Marble Living Interior",
    status: "completed",
    category: "Interiors",
    location: "Ramanagara Town",
    current_phase: null,
    cover_image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Bespoke interior design with custom teakwood paneling and imported Italian marble flooring.",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-5",
    title: "Architectural Blueprint & Vastu Plan",
    status: "completed",
    category: "Vastu Plans",
    location: "Ramanagara District",
    current_phase: null,
    cover_image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Detailed municipal layout drawing engineered according to traditional Indian Vastu Shastra.",
    created_at: new Date().toISOString(),
  },
];

export default function HomePage() {
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeGalleryModal, setActiveGalleryModal] = useState<Project | null>(null);
  const [activeLightboxUrl, setActiveLightboxUrl] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "Architectural Planning with Vastu",
    details: "",
  });

  const supabase = createClient();

  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await (supabase.from("projects") as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setDbProjects(data as Project[]);
      } else {
        setDbProjects(DEMO_PROJECTS);
      }
    }
    loadProjects();
  }, []);

  // Filter projects for Work In Progress section
  const inProgressProjects = dbProjects.filter((p) => p.status === "in_progress");

  // Gallery projects strictly exclude work in progress items
  const galleryProjects = dbProjects.filter((p) => p.status !== "in_progress");

  // Gallery items filtered by category
  const galleryCategories = [
    "All",
    "Construction",
    "3D Elevations",
    "Interiors",
    "Vastu Plans",
  ];

  const filteredGalleryProjects = galleryProjects.filter((p) => {
    if (selectedCategory === "All") return true;
    return p.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  // Handle WhatsApp Contact Submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please fill in your name and phone number.");
      return;
    }

    const messageText =
      `*New Construction Enquiry - KRV Builders*\n\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📞 *Phone:* ${formData.phone}\n` +
      `✉️ *Email:* ${formData.email || "Not provided"}\n` +
      `🏗️ *Service:* ${formData.service}\n` +
      `📝 *Details:* ${formData.details || "No additional details"}`;

    const targetUrl = `https://wa.me/918123758878?text=${encodeURIComponent(messageText)}`;
    window.open(targetUrl, "_blank");
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden bg-stone-50 text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center pt-4 sm:pt-8 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Full Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 transform scale-105 transition duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')`,
          }}
        />

        {/* Soft Architectural Light Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-50/95 via-stone-50/85 to-stone-50/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-transparent to-stone-50/30 z-10" />

        <div className="max-w-7xl mx-auto w-full relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2 sm:pt-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col items-start gap-6 text-left"
          >
            {/* Experience & Trust Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="font-display font-bold text-xs uppercase tracking-architectural text-amber-700 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-2">
                <HardHat className="w-4 h-4 text-amber-600" />
                <span>14+ Years Architectural Experience</span>
              </div>
              <div className="font-display font-bold text-xs uppercase tracking-architectural text-slate-800 bg-slate-900/10 border border-slate-900/20 px-3.5 py-1.5 rounded-full inline-flex items-center gap-2">
                📍 Ramanagara Regional Office
              </div>
            </div>

            {/* Core Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-slate-900">
              Building Dreams With <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800">
                Precision, Strength, & Trust
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-sans font-normal text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              KRV Builders & Developers is Ramanagara&apos;s premier civil construction firm. From Vastu-aligned blueprints and 3D elevations to turnkey RCC residential and commercial structures.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2 font-sans">
              <a
                href="#contact"
                className="px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm tracking-wide shadow-xl shadow-amber-600/25 transition duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-300" />
              </a>

              <a
                href="https://wa.me/918123758878"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm tracking-wide shadow-lg shadow-emerald-600/20 transition duration-300 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-white/20" />
                <span>WhatsApp Us (+91 8123758878)</span>
              </a>
            </div>

            {/* Key Trust Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/80 w-full max-w-lg">
              <div>
                <div className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900">150+</div>
                <div className="font-sans text-xs text-slate-600 font-semibold mt-0.5">Projects Delivered</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-amber-600">100%</div>
                <div className="font-sans text-xs text-slate-600 font-semibold mt-0.5">Vastu Compliant</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900">14+</div>
                <div className="font-sans text-xs text-slate-600 font-semibold mt-0.5">Years Trust</div>
              </div>
            </div>
          </motion.div>

          {/* Right Floating Highlight Card - Dynamic Recently Added Work In Progress Project */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 hidden lg:block"
          >
            {(() => {
              const activeProject =
                inProgressProjects[0] ||
                DEMO_PROJECTS.find((p) => p.status === "in_progress") ||
                dbProjects[0] ||
                DEMO_PROJECTS[0];
              const isInProgress = activeProject.status === "in_progress";

              return (
                <div className="p-7 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl space-y-5 text-slate-900 transition-all">
                  <div className="flex items-center justify-between">
                    <span className={`font-display font-bold text-xs uppercase tracking-architectural px-3 py-1 rounded-full border ${
                      isInProgress
                        ? "text-amber-800 bg-amber-50 border-amber-200"
                        : "text-slate-800 bg-stone-100 border-slate-200"
                    }`}>
                      {isInProgress ? "Featured Live Site" : "Recently Added Project"}
                    </span>
                    <span className="font-sans flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      {isInProgress ? "Live Construction" : "Completed Build"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg sm:text-xl tracking-normal text-slate-900 leading-snug line-clamp-1">
                      {activeProject.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-600 mt-1 font-normal truncate">
                      {isInProgress
                        ? `Phase: ${activeProject.current_phase || "Structural Engineering"}`
                        : `Category: ${activeProject.category} • 📍 ${activeProject.location}`}
                    </p>
                  </div>

                  <div className="relative h-52 sm:h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 group">
                    <img
                      src={getOptimizedImageUrl(activeProject.cover_image, 800)}
                      alt={activeProject.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 font-sans text-[11px] font-semibold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{activeProject.location}</span>
                    </div>
                  </div>

                  <Link
                    href={isInProgress ? "/work-in-progress" : "/gallery"}
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-sans font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition shadow-md group"
                  >
                    <span>{isInProgress ? "View All Work In Progress Sites" : "View Full Project Portfolio"}</span>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              );
            })()}
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES SECTION (8 CARDS) */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="font-display font-bold text-xs uppercase tracking-architectural text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
            Our Architectural & Engineering Solutions
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-900">
            Comprehensive Construction Services
          </h2>
          <p className="font-sans font-normal text-sm sm:text-base text-slate-600 leading-relaxed">
            From initial site measurement to final keys handover, we manage every phase with engineering precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Architectural Planning & Vastu",
              desc: "100% Vastu-compliant 2D blueprints, municipal approval drawings, and optimal room orientations.",
              icon: Compass,
            },
            {
              title: "Structural Design & RCC",
              desc: "Safe structural design, RCC column calculations, slab reinforcements, and earthquake resistance.",
              icon: Ruler,
            },
            {
              title: "Interior Design",
              desc: "Modular kitchens, false ceiling concepts, teakwood carpentry, and modern lighting systems.",
              icon: Layers,
            },
            {
              title: "Photorealistic 3D Elevation",
              desc: "High-resolution 3D exterior renders so you visualize your building before construction starts.",
              icon: Eye,
            },
            {
              title: "Building Construction",
              desc: "Turnkey residential houses, commercial complexes, and apartments with premium materials.",
              icon: Building2,
            },
            {
              title: "Estimation & Evaluation",
              desc: "Itemized BOQ cost estimations, site valuation reports, and budget optimization guidance.",
              icon: DollarSign,
            },
            {
              title: "Consultancy Services",
              desc: "Expert civil engineering advice, material quality checks, and site supervision audits.",
              icon: ShieldCheck,
            },
            {
              title: "Real Estate Solutions",
              desc: "Plot identification, property legal verification, and strategic construction partnerships in Ramanagara.",
              icon: FileCheck,
            },
          ].map((service, idx) => (
            <div
              key={service.title}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5 group-hover:bg-amber-600 group-hover:text-white transition duration-300 shadow-sm">
                  <service.icon className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2 font-medium">
                  {service.desc}
                </p>
              </div>

              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 mt-6 pt-4 border-t border-slate-100"
              >
                <span>Consult On This Service</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WORK IN PROGRESS (LIVE JOB SITES) */}
      <section id="work-in-progress" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 w-fit mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Real-Time Job Sites</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Work In Progress (Active Projects)
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl">
                Explore our ongoing construction sites across Ramanagara. We maintain transparent reporting with live photo updates.
              </p>
            </div>

            <a
              href="#contact"
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 shrink-0"
            >
              <span>Schedule Site Visit</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {inProgressProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl bg-slate-800/90 border border-slate-700 overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative h-52 overflow-hidden group">
                    <img
                      src={getOptimizedImageUrl(project.cover_image, 800)}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                    {/* Status Pill */}
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                      In Progress
                    </div>

                    {/* Phase Badge */}
                    {project.current_phase && (
                      <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur border border-slate-700 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-xl truncate">
                        Phase: {project.current_phase}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      📍 {project.location}
                    </div>
                    <h3 className="text-lg font-bold text-white leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {project.description || "Active construction site supervised by KRV engineers."}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setActiveGalleryModal(project)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Site Photos</span>
                  </button>

                  <a
                    href={`https://wa.me/918123758878?text=${encodeURIComponent(
                      `Hello KRV Builders, I am enquiring about your Work In Progress project: ${project.title}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow"
                    title="Enquire on WhatsApp about this project"
                  >
                    <MessageSquare className="w-4 h-4 fill-white/20" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PINTEREST-STYLE MASONRY PORTFOLIO */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-widest font-extrabold text-amber-700 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200">
            Portfolio Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Completed Projects & Architectural Renders
          </h2>
          <p className="text-slate-600 text-sm font-normal">
            Browse our masonry portfolio featuring residential villas, commercial facades, and 3D Vastu models.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition duration-200 ${
                selectedCategory === cat
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                  : "bg-white text-slate-700 hover:bg-stone-200 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tailwind Masonry Multi-Column Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {filteredGalleryProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveLightboxUrl(project.cover_image)}
              className="break-inside-avoid relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition duration-300 cursor-pointer group"
            >
              <img
                src={getOptimizedImageUrl(project.cover_image, 600)}
                alt={project.title}
                className="w-full h-auto object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                  {project.category}
                </span>
                <h4 className="text-sm font-bold mt-0.5">{project.title}</h4>
                <span className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
                  <Maximize2 className="w-3 h-3 text-amber-400" /> Click to expand image
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE US (4-PILLAR GRID) */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-md">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs uppercase tracking-widest font-extrabold text-amber-700 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200">
              Why Partner With KRV
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Built On Integrity, Engineered For Lifetime Durability
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                1. Reputation & Client Trust
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                14+ years of unblemished trust in Ramanagara with over 150+ completed structural projects and satisfied homeowners.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                2. Operational Expansion
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                In-house team of licensed civil engineers, 3D visualizers, and skilled workforce capable of handling simultaneous job sites.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                3. Diverse Project Portfolio
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Proven record across luxury residential villas, multi-family duplexes, commercial retail spaces, and interior fit-outs.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                4. Management & Financial Stability
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Transparent stage-by-stage billing, zero hidden costs, and guaranteed on-time completion timelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE CONTACT & GOOGLE MAP SECTION */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Left Info Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
                Contact & Office Details
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                Visit Our Office In Ramanagara
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Drop by our office or call our senior engineers directly for site visits and Vastu planning.
              </p>
            </div>

            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900">Headquarters Address</h3>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=1st+Floor,+Above+Canara+Bank+ATM,+Moti+Nagar+Extension,+Ramanagara,+Karnataka+562159"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition flex items-center gap-1 shrink-0"
                  >
                    <span>Open Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-1 font-medium">
                  1st Floor, Above Canara Bank ATM, Moti Nagar Extension, Ramanagara, Karnataka 562159
                </p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Direct Helpline Numbers</h3>
                <div className="flex flex-col gap-1 mt-1 text-xs text-slate-800 font-bold">
                  <a href="tel:+918123758878" className="hover:text-amber-600 transition">
                    +91 8123758878
                  </a>
                  <a href="tel:+918660256319" className="hover:text-amber-600 transition">
                    +91 8660256319
                  </a>
                </div>
              </div>
            </div>

            {/* Email & Hours */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Email & Schedule</h3>
                <a
                  href="mailto:krvbuildersndevelopers@gmail.com"
                  className="text-xs text-amber-600 hover:underline mt-1 block truncate font-bold"
                >
                  krvbuildersndevelopers@gmail.com
                </a>
                <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Mon–Fri (9:00 AM – 8:00 PM), Weekends (By Appointment)
                </p>
              </div>
            </div>

            {/* Embedded Google Maps Frame */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-60 relative group">
              <iframe
                title="KRV Builders Office Map - Moti Nagar Extension Ramanagara"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3893.6337199042646!2d77.27641257585097!3d12.737402687556754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae365a6a6833d7%3A0x6b2b7ecb38b1f5e8!2sCanara%20Bank%20ATM%2C%20Moti%20Nagar%20Extension%2C%20Ramanagara%2C%20Karnataka%20562159!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
              <div className="absolute bottom-3 right-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1st+Floor,+Above+Canara+Bank+ATM,+Moti+Nagar+Extension,+Ramanagara,+Karnataka+562159"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white font-bold text-xs shadow-lg backdrop-blur-sm transition flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Location in Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-md">
              <h3 className="text-2xl font-bold text-slate-900">Enquire / Book Consultation</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Fill in your project details below and submit to open an encoded chat with our engineering lead.
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 Phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="yourname@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Required Service *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                    >
                      <option value="Architectural Planning with Vastu">Architectural Planning with Vastu</option>
                      <option value="Building Construction">Turnkey Building Construction</option>
                      <option value="Structural Engineering">Structural Engineering & RCC</option>
                      <option value="3D Elevation">Photorealistic 3D Elevation</option>
                      <option value="Interior Design">Interior Design</option>
                      <option value="Estimation & Costing">Estimation & Costing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Plot Dimensions / Project Specifications
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g. 30x40 plot in Ramanagara, planning G+2 residential house..."
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-white/20" />
                  <span>Send Enquiry via WhatsApp (+91 8123758878)</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY MODAL FOR SITE PHOTOS */}
      {activeGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 text-white w-full max-w-4xl rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{activeGalleryModal.title}</h3>
                <p className="text-xs text-amber-400 mt-0.5">
                  Live Site Photos • Phase: {activeGalleryModal.current_phase || "In Progress"}
                </p>
              </div>
              <button
                onClick={() => setActiveGalleryModal(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  activeGalleryModal.cover_image,
                  ...(activeGalleryModal.gallery_images || []),
                ].map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveLightboxUrl(imgUrl)}
                    className="h-48 rounded-2xl overflow-hidden border border-slate-700 cursor-pointer group relative"
                  >
                    <img
                      src={getOptimizedImageUrl(imgUrl, 600)}
                      alt={`Site photo ${idx}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Maximize2 className="w-6 h-6 text-amber-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE IMAGE LIGHTBOX MODAL */}
      {activeLightboxUrl && (
        <div
          onClick={() => setActiveLightboxUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-pointer"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={getOptimizedImageUrl(activeLightboxUrl, 1200)}
              alt="Expanded view"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-800 shadow-2xl"
            />
            <button
              onClick={() => setActiveLightboxUrl(null)}
              className="absolute -top-4 -right-4 p-2 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-700 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
