"use client";

import { useState, useEffect, useMemo } from "react";
import type { Project } from "@/types/database";
import { getMediaUrl } from "@/lib/media";
import {
  Sparkles,
  Maximize2,
  X,
  Loader2,
  Building2,
  MapPin,
  Filter,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
  Compass,
} from "lucide-react";

type GalleryCategoryTab =
  | "All"
  | "Vastu 2D & 3D Planning"
  | "Elevation Design"
  | "Structural Design"
  | "Interior Design";

const CATEGORY_TABS: { id: GalleryCategoryTab; label: string }[] = [
  { id: "All", label: "All Works" },
  { id: "Vastu 2D & 3D Planning", label: "Vastu 2D & 3D Planning" },
  { id: "Elevation Design", label: "Elevation Design" },
  { id: "Structural Design", label: "Structural Design" },
  { id: "Interior Design", label: "Interior Design" },
];

export interface GalleryItem {
  id: string;
  projectId: string;
  title: string;
  category: string;
  location: string;
  description: string | null;
  objectKey: string;
  isCover: boolean;
}

type ProjectsResponse = {
  projects?: Project[];
  error?: string;
};

type ProjectImage = {
  id: string;
  project_id: string;
  object_key: string;
  image_type: "cover" | "gallery" | string;
  sort_order: number;
};

type ImagesResponse = {
  images?: ProjectImage[];
  error?: string;
};

/**
 * Normalizes a raw project category string to check matching for tabs.
 */
function matchesCategoryTab(rawCategory: string, tab: GalleryCategoryTab): boolean {
  if (tab === "All") return true;

  const cat = (rawCategory || "").toLowerCase().trim();

  switch (tab) {
    case "Vastu 2D & 3D Planning":
      return (
        cat.includes("vastu") ||
        cat.includes("architectural") ||
        cat.includes("planning") ||
        cat.includes("2d") ||
        cat.includes("3d")
      );
    case "Elevation Design":
      return (
        cat.includes("elevation") ||
        cat.includes("exterior") ||
        cat.includes("facade")
      );
    case "Structural Design":
      return cat.includes("structural") || cat.includes("structure");
    case "Interior Design":
      return cat.includes("interior") || cat.includes("indoor");
    default:
      return true;
  }
}

export default function PublicGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<GalleryCategoryTab>("All");
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGalleryData();
  }, []);

  // Listen to Escape key to close Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveLightboxItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchGalleryData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/projects", { cache: "no-store" });
      const json = (await res.json()) as ProjectsResponse;

      if (!res.ok) {
        throw new Error(json.error || "Failed to load gallery projects.");
      }

      const projectsList = json.projects || [];

      // Extract all gallery images and cover images across projects
      const galleryItemsList: GalleryItem[] = [];

      await Promise.all(
        projectsList.map(async (project) => {
          // If project has project_images API available, fetch detailed records
          try {
            const imageRes = await fetch(
              `/api/admin/projects/${encodeURIComponent(project.id)}/images`
            );
            if (imageRes.ok) {
              const imageJson = (await imageRes.json()) as ImagesResponse;
              const projectImages = imageJson.images || [];

              if (projectImages.length > 0) {
                projectImages.forEach((img) => {
                  galleryItemsList.push({
                    id: img.id,
                    projectId: project.id,
                    title: project.title,
                    category: project.category || "Elevation Design",
                    location: project.location || "Ramanagara",
                    description: project.description || null,
                    objectKey: img.object_key,
                    isCover: img.image_type === "cover",
                  });
                });
                return;
              }
            }
          } catch {
            // Fallback to project fields if images API fails
          }

          // Fallback: cover_image and gallery_images from project model
          if (project.cover_image) {
            galleryItemsList.push({
              id: `${project.id}-cover`,
              projectId: project.id,
              title: project.title,
              category: project.category || "Elevation Design",
              location: project.location || "Ramanagara",
              description: project.description || null,
              objectKey: project.cover_image,
              isCover: true,
            });
          }

          if (Array.isArray(project.gallery_images)) {
            project.gallery_images.forEach((key, index) => {
              if (key && key !== project.cover_image) {
                galleryItemsList.push({
                  id: `${project.id}-gallery-${index}`,
                  projectId: project.id,
                  title: project.title,
                  category: project.category || "Elevation Design",
                  location: project.location || "Ramanagara",
                  description: project.description || null,
                  objectKey: key,
                  isCover: false,
                });
              }
            });
          }
        })
      );

      // Deduplicate items by objectKey
      const uniqueItems: GalleryItem[] = [];
      const seenKeys = new Set<string>();

      for (const item of galleryItemsList) {
        if (item.objectKey && !seenKeys.has(item.objectKey)) {
          seenKeys.add(item.objectKey);
          uniqueItems.push(item);
        }
      }

      setItems(uniqueItems);
    } catch (err: unknown) {
      console.error("Public gallery loading error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load showcase gallery images."
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on selected tab
  const filteredItems = useMemo(() => {
    return items.filter((item) => matchesCategoryTab(item.category, activeTab));
  }, [items, activeTab]);

  // Tab count stats
  const categoryCounts = useMemo(() => {
    const counts: Record<GalleryCategoryTab, number> = {
      All: items.length,
      "Vastu 2D & 3D Planning": 0,
      "Elevation Design": 0,
      "Structural Design": 0,
      "Interior Design": 0,
    };

    items.forEach((item) => {
      if (matchesCategoryTab(item.category, "Vastu 2D & 3D Planning")) counts["Vastu 2D & 3D Planning"]++;
      if (matchesCategoryTab(item.category, "Elevation Design")) counts["Elevation Design"]++;
      if (matchesCategoryTab(item.category, "Structural Design")) counts["Structural Design"]++;
      if (matchesCategoryTab(item.category, "Interior Design")) counts["Interior Design"]++;
    });

    return counts;
  }, [items]);

  return (
    <main className="min-h-screen bg-[#0e1412] text-stone-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-amber-400 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Architectural Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-[#141d1a] border border-[#263530] p-8 sm:p-12 shadow-2xl">
          <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(#d9b56d_1px,transparent_1px),linear-gradient(90deg,#d9b56d_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Architectural Showcase & Portfolio</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              KRV Builders Design Gallery
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-normal">
              Explore our curated portfolio of premium 3D front elevations, interior designs,
              vastu architectural planning, and turnkey structural completed projects across Ramanagara.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-stone-400 font-semibold">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>{items.length} Architectural Assets</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Pinterest-Style Masonry Grid</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Ramanagara & Vicinity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="sticky top-20 z-30 bg-[#0e1412]/90 backdrop-blur-md py-3 border-b border-[#23302b]">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-bold px-2 shrink-0">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Filter:</span>
            </div>

            {CATEGORY_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const count = categoryCounts[tab.id];

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer ${isActive
                      ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 scale-[1.02]"
                      : "bg-[#182320] text-stone-300 hover:bg-[#23312c] hover:text-white border border-[#2b3b35]"
                    }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${isActive
                        ? "bg-slate-950/20 text-slate-950"
                        : "bg-stone-800/80 text-stone-400"
                      }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Unable to Load Gallery Images</h4>
                <p className="text-xs text-rose-300 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchGalleryData}
              className="px-4 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
            <p className="text-sm font-semibold text-stone-400">
              Loading architectural showcase images...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="py-20 text-center bg-[#141d1a] rounded-3xl border border-[#263530] p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-stone-800/80 border border-stone-700 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">No Images Found for "{activeTab}"</h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              There are currently no gallery items categorized under {activeTab}. Select another category tab above to view our other design creations.
            </p>
            <button
              onClick={() => setActiveTab("All")}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
            >
              View All Works ({items.length})
            </button>
          </div>
        )}

        {/* Responsive Pinterest-Style Masonry Grid */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5">
            {filteredItems.map((item) => {
              const imageUrl = getMediaUrl(item.objectKey);

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveLightboxItem(item)}
                  className="break-inside-avoid relative group overflow-hidden rounded-2xl bg-[#151f1c] border border-[#283732] shadow-lg hover:shadow-2xl hover:border-amber-400/50 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer"
                >
                  {/* Image */}
                  <img
                    src={imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      // Handle broken image safely
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />

                  {/* Gradient & Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
                    {/* Top Tag */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 shadow">
                        {item.category}
                      </span>
                      <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white shadow">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="space-y-1 text-left">
                      <h4 className="text-sm font-bold text-white leading-snug line-clamp-2 drop-shadow">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-stone-300 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{item.location}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Lightbox Modal */}
        {activeLightboxItem && (
          <div
            onClick={() => setActiveLightboxItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/95 backdrop-blur-xl cursor-pointer animate-in fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] w-full flex flex-col bg-[#141d1a] border border-[#2e3e38] rounded-3xl overflow-hidden shadow-2xl cursor-default"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveLightboxItem(null)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-slate-950/80 hover:bg-amber-400 hover:text-slate-950 text-white rounded-full transition shadow-lg border border-white/10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Image Container */}
              <div className="relative flex-1 bg-slate-950 flex items-center justify-center min-h-[300px] max-h-[70vh] p-2">
                <img
                  src={getMediaUrl(activeLightboxItem.objectKey)}
                  alt={activeLightboxItem.title}
                  className="max-w-full max-h-[68vh] object-contain rounded-xl"
                />
              </div>

              {/* Lightbox Information Footer */}
              <div className="p-6 bg-[#182320] border-t border-[#263630] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-amber-400 uppercase bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-md">
                      {activeLightboxItem.category}
                    </span>
                    <span className="text-xs text-stone-400 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {activeLightboxItem.location}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {activeLightboxItem.title}
                  </h3>
                  {activeLightboxItem.description && (
                    <p className="text-xs text-stone-300 mt-1 max-w-2xl font-normal">
                      {activeLightboxItem.description}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <a
                    href={`/contact?project=${encodeURIComponent(activeLightboxItem.title)}`}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-amber-400/10"
                  >
                    Inquire About This Design
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}