"use client";

import { useState, useEffect } from "react";
import { Project, ProjectStatus, ConstructionPhase } from "@/types/database";
import ImageUploader from "./ImageUploader";
import MultiImageUploader from "./MultiImageUploader";
import { MAX_PROJECT_IMAGES, MAX_SECTION_IMAGES } from "@/lib/cloudinary";
import { Building2, X, Loader2, Layers } from "lucide-react";

export const PHASE_OPTIONS: ConstructionPhase[] = [
  "Site Excavation & Earthwork",
  "Foundation & Column Casting",
  "Brickwork, Lintels & Slab Casting",
  "Plastering & Electrical Concealing",
  "Flooring & Tile Work",
  "Interior Finishing & Handover",
];

export const CATEGORY_OPTIONS = [
  "Residential Villa",
  "Commercial Complex",
  "3D Elevation",
  "Interior Design",
  "Structural Construction",
  "Vastu Layout",
];

interface ProjectModalProps {
  isOpen: boolean;
  editingProject: Project | null;
  onClose: () => void;
  onSave: (payload: any, editingId?: string) => Promise<void>;
  inProgressImageCount?: number;
  completedImageCount?: number;
}

export default function ProjectModal({
  isOpen,
  editingProject,
  onClose,
  onSave,
  inProgressImageCount = 0,
  completedImageCount = 0,
}: ProjectModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [location, setLocation] = useState("Ramanagara");
  const [status, setStatus] = useState<ProjectStatus>("in_progress");
  const [currentPhase, setCurrentPhase] = useState<string>(PHASE_OPTIONS[0]);
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setCategory(editingProject.category);
      setLocation(editingProject.location);
      setStatus(editingProject.status);
      setCurrentPhase(editingProject.current_phase || PHASE_OPTIONS[0]);
      setDescription(editingProject.description || "");
      setCoverImage(editingProject.cover_image);
      setGalleryImages(editingProject.gallery_images || []);
    } else {
      setTitle("");
      setCategory(CATEGORY_OPTIONS[0]);
      setLocation("Ramanagara");
      setStatus("in_progress");
      setCurrentPhase(PHASE_OPTIONS[0]);
      setDescription("");
      setCoverImage("");
      setGalleryImages([]);
    }
    setErrorMessage(null);
  }, [editingProject, isOpen]);

  if (!isOpen) return null;

  const currentProjectImageCount = (coverImage ? 1 : 0) + galleryImages.length;
  const totalForSelectedSection =
    status === "in_progress" ? inProgressImageCount : completedImageCount;
  const currentProjectSectionCount =
    editingProject?.status === status ? currentProjectImageCount : 0;
  const otherSectionImageCount = totalForSelectedSection - currentProjectSectionCount;
  const sectionSlots = Math.max(MAX_SECTION_IMAGES - otherSectionImageCount, 0);
  const maxImagesForThisProject = Math.min(
    MAX_PROJECT_IMAGES,
    currentProjectImageCount + sectionSlots
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Project Title is required.");
      return;
    }
    if (!coverImage) {
      setErrorMessage("Please upload a cover image.");
      return;
    }
    if (1 + galleryImages.length > MAX_PROJECT_IMAGES) {
      setErrorMessage(
        `A project can contain a maximum of ${MAX_PROJECT_IMAGES} images including the cover. Remove existing images before saving.`
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        title,
        category,
        location,
        status,
        current_phase: status === "in_progress" ? currentPhase : null,
        description,
        cover_image: coverImage,
        gallery_images: galleryImages,
      };

      await onSave(payload, editingProject?.id);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save project.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-slate-900">
              {editingProject ? "Edit Project Details" : "Create New Project"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramanagara Flagship Villa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Location *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Extension Mohalla, Ramanagara"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Status *
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("in_progress")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
                    status === "in_progress"
                      ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                      : "bg-stone-50 text-slate-700 border-slate-200"
                  }`}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("completed")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
                    status === "completed"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-stone-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>

          {/* Current Phase Dropdown (Visible only when status === 'in_progress') */}
          {status === "in_progress" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Current Execution Phase *</span>
              </label>
              <select
                value={currentPhase}
                onChange={(e) => setCurrentPhase(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-sm text-amber-900 font-semibold focus:outline-none focus:border-amber-600"
              >
                {PHASE_OPTIONS.map((phase) => (
                  <option key={phase} value={phase}>
                    {phase}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Cover Image Component */}
          <ImageUploader
            value={coverImage}
            onChange={setCoverImage}
            canUpload={Boolean(coverImage) || sectionSlots > 0}
          />

          {/* Gallery Images Component */}
          <MultiImageUploader
            values={galleryImages}
            onChange={setGalleryImages}
            coverImage={coverImage}
            maxImages={maxImagesForThisProject}
          />

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description / Project Specifications
            </label>
            <textarea
              rows={3}
              placeholder="Architectural specs, materials used, client requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition flex items-center gap-2 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{editingProject ? "Update Project" : "Save Project"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
