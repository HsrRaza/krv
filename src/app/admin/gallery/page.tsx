"use client";

import { useState, useEffect } from "react";
import type { Project } from "@/types/database";
import ImageUploader from "@/components/admin/ImageUploader";
import { getMediaUrl } from "@/lib/media";
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
  Sparkles,
} from "lucide-react";

type ProjectImage = {
  id: string;
  project_id: string;
  object_key: string;
  image_type: "cover" | "gallery" | string;
  sort_order: number;
  created_at: string;
};

type ProjectsResponse = {
  projects?: Project[];
  error?: string;
};

type ImagesResponse = {
  images?: ProjectImage[];
  error?: string;
};

export default function AdminGalleryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectImages, setProjectImages] = useState<
    Record<string, ProjectImage[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [activeLightboxUrl, setActiveLightboxUrl] =
    useState<string | null>(null);
  const [deletingImageId, setDeletingImageId] =
    useState<string | null>(null);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Elevation Design",
    location: "Ramanagara",
    description: "",
    cover_image: "",
  });

  const getImageUrl = (objectKey: string) => {
    return getMediaUrl(objectKey);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/projects");
      const json = (await res.json()) as ProjectsResponse;

      if (!res.ok) {
        throw new Error(json.error || "Failed to fetch projects.");
      }

      const galleryItemsOnly = (json.projects || []).filter(
        (project) => project.status === "completed"
      );

      setProjects(galleryItemsOnly);

      const imageEntries = await Promise.all(
        galleryItemsOnly.map(async (project) => {
          try {
            const imageRes = await fetch(
              `/api/admin/projects/${encodeURIComponent(
                project.id
              )}/images`
            );

            const imageJson =
              (await imageRes.json()) as ImagesResponse;

            return [
              project.id,
              imageJson.images || [],
            ] as const;
          } catch (error) {
            console.error(
              `Failed to fetch images for project ${project.id}:`,
              error
            );

            return [project.id, []] as const;
          }
        })
      );

      setProjectImages(Object.fromEntries(imageEntries));
    } catch (error) {
      console.error("Error fetching projects for gallery:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load gallery."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGalleryItem = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!formData.title || !formData.cover_image) {
      alert("Please provide a title and upload a cover image.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          location: formData.location || "Ramanagara",
          description: formData.description,
          cover_image: formData.cover_image,
          gallery_images: [],
          status: "completed",
        }),
      });

      const json = (await res.json()) as {
        project?: Project;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(
          json.error || "Failed to save gallery item."
        );
      }

      alert("Gallery item uploaded successfully!");

      setFormData({
        title: "",
        category: "Elevation Design",
        location: "Ramanagara",
        description: "",
        cover_image: "",
      });

      setShowUploadForm(false);

      await fetchProjects();
    } catch (error) {
      alert(
        `Submission error: ${
          error instanceof Error
            ? error.message
            : "Unknown error"
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteImage = async (
    project: Project,
    image: ProjectImage
  ) => {
    const isCover = image.image_type === "cover";

    const confirmDelete = window.confirm(
      isCover
        ? "This is the primary cover image. Delete this entire project/gallery item?"
        : "Delete this photo from R2 and remove it from the gallery?"
    );

    if (!confirmDelete) return;

    setDeletingImageId(image.id);

    try {
      if (isCover) {
        const deleteResponse = await fetch(
          `/api/admin/projects?id=${encodeURIComponent(
            project.id
          )}`,
          {
            method: "DELETE",
          }
        );

        const deleteJson = (await deleteResponse.json()) as {
          error?: string;
        };

        if (!deleteResponse.ok) {
          throw new Error(
            deleteJson.error ||
              "Failed to delete the project."
          );
        }
      } else {
        const deleteResponse = await fetch(
          `/api/admin/projects/${encodeURIComponent(
            project.id
          )}/images?imageId=${encodeURIComponent(image.id)}`,
          {
            method: "DELETE",
          }
        );

        const deleteJson = (await deleteResponse.json()) as {
          error?: string;
        };

        if (!deleteResponse.ok) {
          throw new Error(
            deleteJson.error ||
              "Failed to delete the project image."
          );
        }
      }

      await fetchProjects();
    } catch (error) {
      alert(
        `Error deleting asset: ${
          error instanceof Error
            ? error.message
            : "Unknown error"
        }`
      );
    } finally {
      setDeletingImageId(null);
    }
  };

  const galleryImageCount = Object.values(projectImages).reduce(
    (total, images) => total + images.length,
    0
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
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
            Upload showcase designs categorized under
            Elevation Design, Architectural Planning, or
            Interior Design.
          </p>
        </div>

        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="relative z-10 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition shrink-0"
        >
          {showUploadForm ? (
            <X className="w-4 h-4" />
          ) : (
            <PlusCircle className="w-4 h-4" />
          )}

          <span>
            {showUploadForm
              ? "Close Form"
              : "Upload Gallery Item"}
          </span>
        </button>
      </div>

      {/* Upload Form */}
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Category *
              </label>

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-slate-200 text-slate-900 text-sm font-bold focus:outline-none focus:border-amber-600 focus:bg-white transition"
              >
                <option value="Elevation Design">
                  Elevation Design
                </option>
                <option value="Architectural Planning">
                  Architectural Planning
                </option>
                <option value="Interior Design">
                  Interior Design
                </option>
                <option value="3D Design">
                  3D Design
                </option>
                <option value="4D Design">
                  4D Design
                </option>
                <option value="Structural Design">
                  Structural Design
                </option>
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: e.target.value,
                  })
                }
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <ImageUploader
              value={formData.cover_image}
              onChange={(objectKey) =>
                setFormData({
                  ...formData,
                  cover_image: objectKey,
                })
              }
              canUpload={true}
              label="Select Image to Upload (R2 • WebP • Max 5MB)"
              projectId="gallery-upload"
            />
          </div>

          <p className="text-xs text-slate-500">
            You can upload as many gallery images as needed.
            There is no image-count limit.
          </p>

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
              disabled={
                submitting || !formData.cover_image
              }
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

      {/* Gallery */}
      {loading ? (
        <div className="space-y-6">
          <div className="py-8 text-center text-slate-500 flex flex-col items-center gap-2">
            <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
            <span className="text-xs font-semibold">
              Loading gallery showcase assets...
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-3 space-y-3 animate-pulse"
              >
                <div className="aspect-4/3 rounded-xl bg-slate-200 w-full" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />

          <div className="text-base font-bold text-slate-800">
            No Gallery Items
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Use the upload form above to add Elevation
            Design, Architectural Planning, or Interior
            Design photos.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {projects.map((project) => {
            const images = projectImages[project.id] || [];

            return (
              <div
                key={project.id}
                className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {project.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="truncate max-w-[200px]">
                          📍 {project.location}
                        </span>

                        <span>•</span>

                        <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                          {project.category}
                        </span>

                        {project.status === "in_progress" && (
                          <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 shrink-0">
                            Work In Progress Site
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-slate-600 bg-[#f4f1eb] px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto shrink-0">
                    {images.length} Image(s)
                  </span>
                </div>

                {images.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No registered images for this project.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {images.map((image, idx) => {
                      const imageUrl = getImageUrl(
                        image.object_key
                      );

                      const isCover =
                        image.image_type === "cover";

                      return (
                        <div
                          key={image.id}
                          className="group relative bg-stone-50 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
                        >
                          {/* Fixed Aspect Ratio Image Container */}
                          <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={`${project.title} Asset ${idx + 1}`}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {isCover && (
                              <div className="absolute top-2.5 left-2.5 bg-amber-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-md tracking-wider">
                                Cover
                              </div>
                            )}

                            {/* Action Buttons (Visible on hover on desktop, always touch-accessible) */}
                            <div className="absolute inset-0 bg-slate-950/40 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2.5 p-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveLightboxUrl(
                                    imageUrl
                                  )
                                }
                                className="p-2.5 rounded-xl bg-white text-slate-900 hover:bg-amber-500 hover:text-white transition-all shadow-md cursor-pointer"
                                title="Expand Photo"
                                aria-label="Expand photo"
                              >
                                <Maximize2 className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteImage(
                                    project,
                                    image
                                  )
                                }
                                disabled={
                                  deletingImageId ===
                                  image.id
                                }
                                className="p-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                                title="Delete Image"
                                aria-label="Delete image"
                              >
                                {deletingImageId === image.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Compact Card Metadata */}
                          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                            <span className="font-bold text-slate-800 truncate">
                              Asset #{idx + 1}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[120px]">
                              {image.image_type}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {activeLightboxUrl && (
        <div
          onClick={() => setActiveLightboxUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-pointer"
        >
          <div
            className="relative max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeLightboxUrl}
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
