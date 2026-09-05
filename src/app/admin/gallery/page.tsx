"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { Project } from "@/types/database";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  Image as ImageIcon,
  Trash2,
  Maximize2,
  X,
  Loader2,
  Building2,
  PlusCircle,
  Upload,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";

export default function AdminGalleryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLightboxUrl, setActiveLightboxUrl] = useState<string | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  // New Gallery Item Upload Form State
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "3D Elevation", // Default: "3D Elevation" | "Plan" | "Interior Design"
    location: "Ramanagara",
    description: "",
    cover_image: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const json = await res.json();
      if (res.ok && json.projects) {
        // Exclude work in progress projects from gallery view
        const galleryItemsOnly = json.projects.filter((p: Project) => p.status !== "in_progress");
        setProjects(galleryItemsOnly);
      }
    } catch (e) {
      console.error("Error fetching projects for gallery:", e);
    }
    setLoading(false);
  };

  const handleCreateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.cover_image) {
      alert("Please provide a title and upload a cover image.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          location: formData.location || "Ramanagara",
          description: formData.description,
          cover_image: formData.cover_image,
          gallery_images: [],
          status: "completed", // Set as completed gallery item (not work-in-progress)
        }),
      });

      const json = await res.json();
      if (res.ok) {
        alert("Gallery item uploaded successfully!");
        setFormData({
          title: "",
          category: "3D Elevation",
          location: "Ramanagara",
          description: "",
          cover_image: "",
        });
        setShowUploadForm(false);
        fetchProjects();
      } else {
        alert(`Error saving gallery item: ${json.error}`);
      }
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete an individual gallery photo directly
  const handleDeleteImage = async (project: Project, targetUrl: string, isCover: boolean) => {
    const confirmDelete = window.confirm(
      isCover
        ? "This is the primary cover image. Delete this entire project/gallery item?"
        : "Delete this photo from Cloudinary and remove it from gallery item?"
    );

    if (!confirmDelete) return;

    setDeletingUrl(targetUrl);

    try {
      const urlsToDelete = isCover
        ? [project.cover_image, ...(project.gallery_images || [])].filter(Boolean)
        : [targetUrl];
      const purgeResponse = await fetch("/api/admin/cloudinary-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urlsToDelete }),
      });

      if (!purgeResponse.ok) {
        const errorJson = await purgeResponse.json().catch(() => ({}));
        throw new Error(errorJson.error || "Failed to delete the image from Cloudinary.");
      }

      if (isCover) {
        // Delete full project if cover is removed
        const deleteResponse = await fetch(`/api/admin/projects?id=${project.id}`, {
          method: "DELETE",
        });

        if (!deleteResponse.ok) {
          const errorJson = await deleteResponse.json().catch(() => ({}));
          throw new Error(errorJson.error || "Failed to delete the project record.");
        }

        fetchProjects();
      } else {
        // 2. Remove URL from project.gallery_images via API
        const updatedGallery = (project.gallery_images || []).filter((u) => u !== targetUrl);
        const res = await fetch("/api/admin/projects", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: project.id, gallery_images: updatedGallery }),
        });

        const json = await res.json();
        if (!res.ok) {
          alert(`Failed to update project gallery: ${json.error}`);
        } else {
          fetchProjects();
        }
      }
    } catch (err: any) {
      alert(`Error purging asset: ${err.message}`);
    } finally {
      setDeletingUrl(null);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-[#18211f] text-white p-6 sm:p-8 rounded-2xl border border-[#34413c] shadow-lg">
        <div className="absolute inset-0 opacity-[0.1] bg-[linear-gradient(#d9b56d_1px,transparent_1px),linear-gradient(90deg,#d9b56d_1px,transparent_1px)] bg-size-[48px_48px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[11px] font-bold text-amber-300 uppercase tracking-architectural mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin Media Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Gallery & Media Manager
          </h1>
          <p className="text-sm text-[#c5cfca] mt-2 max-w-2xl">
            Upload showcase designs categorized under 3D Elevation, Architectural Plan, or Interior Design.
          </p>
        </div>

        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="relative z-10 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition shrink-0"
        >
          {showUploadForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          <span>{showUploadForm ? "Close Form" : "Upload Gallery Item"}</span>
        </button>
      </div>

      {/* GALLERY IMAGE UPLOAD FORM */}
      {showUploadForm && (
        <form
          onSubmit={handleCreateGalleryItem}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-200 shadow-md space-y-6 animate-in fade-in slide-in-from-top-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-600" />
              <span>Add New Gallery Image & Category</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Categorized for public gallery showcase
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Title / Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Modern Duplex 3D Front Elevation"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-slate-200 text-slate-900 text-sm font-bold focus:outline-none focus:border-amber-600 focus:bg-white transition"
              >
                <option value="3D Elevation">3D Elevation</option>
                <option value="Plan">Plan (Architectural / Vastu)</option>
                <option value="Interior Design">Interior Design</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Ramanagara Extension"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Description / Notes
              </label>
              <input
                type="text"
                placeholder="Brief details about the design or materials used..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <ImageUploader
              value={formData.cover_image}
              onChange={(url) => setFormData({ ...formData, cover_image: url })}
              label="Select Image to Upload (Cloudinary Direct • Max 5MB)"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowUploadForm(false)}
              className="px-5 py-3 rounded-xl bg-stone-100 text-slate-700 font-bold text-xs hover:bg-stone-200 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !formData.cover_image}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-600/20 transition flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Gallery Item...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish to Gallery</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* GALLERY LISTING & ASSET MANAGER */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <span className="text-sm font-medium">Loading gallery showcase...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <div className="text-base font-bold text-slate-800">No Gallery Items</div>
          <p className="text-xs text-slate-500 mt-1">Use the upload form above to add 3D Elevation, Plan, or Interior Design photos.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {projects.map((project) => {
            const allImages = [
              { url: project.cover_image, isCover: true },
              ...(project.gallery_images || []).map((url) => ({
                url,
                isCover: false,
              })),
            ];

            return (
              <div
                key={project.id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>📍 {project.location}</span>
                        <span>•</span>
                        <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {project.category}
                        </span>
                        {project.status === "in_progress" && (
                          <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                            Work In Progress Site
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 bg-[#f4f1eb] px-3 py-1.5 rounded-lg border border-slate-200">
                    {allImages.length} Image(s)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {allImages.map((imgItem, idx) => (
                    <div
                      key={idx}
                      className="relative h-36 rounded-xl overflow-hidden border border-slate-200 shadow-sm group bg-slate-900"
                    >
                      <img
                        src={getOptimizedImageUrl(imgItem.url, 400)}
                        alt={`Asset ${idx}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />

                      {imgItem.isCover && (
                        <div className="absolute top-2 left-2 bg-amber-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
                          Cover
                        </div>
                      )}

                      {/* Action Hover Controls */}
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button
                          onClick={() => setActiveLightboxUrl(imgItem.url)}
                          className="p-2 rounded-xl bg-white text-slate-900 hover:bg-amber-500 hover:text-white transition shadow"
                          title="Expand Photo"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteImage(project, imgItem.url, imgItem.isCover)
                          }
                          disabled={deletingUrl === imgItem.url}
                          className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition shadow"
                          title="Delete Image from Cloudinary"
                        >
                          {deletingUrl === imgItem.url ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightboxUrl && (
        <div
          onClick={() => setActiveLightboxUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-pointer"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={getOptimizedImageUrl(activeLightboxUrl, 1200)}
              alt="Expanded preview"
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
    </main>
  );
}
