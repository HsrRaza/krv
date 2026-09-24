/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";

import type {
  Project,
  ProjectStatus,
  ConstructionPhase,
} from "@/types/database";

import ImageUploader from "./ImageUploader";
import MultiImageUploader from "./MultiImageUploader";

import {
  CONSTRUCTION_PHASES,
  PROJECT_CATEGORIES,
} from "@/lib/project-options";

export const CATEGORY_OPTIONS: string[] = [...PROJECT_CATEGORIES];

export const PHASE_OPTIONS: ConstructionPhase[] = [
  ...CONSTRUCTION_PHASES,
];

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    project: {
      title: string;
      category: string;
      location: string;
      status: ProjectStatus;
      current_phase: string | null;
      description: string | null;
      cover_image: string;
      gallery_images: string[];
    },
    id?: string
  ) => Promise<void>;
  editingProject?: Project | null;
}

export default function ProjectModal({
  isOpen,
  onClose,
  onSave,
  editingProject = null,
}: ProjectModalProps) {
  const [projectId, setProjectId] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(
    CATEGORY_OPTIONS[0] ?? ""
  );
  const [location, setLocation] = useState("Ramanagara");

  const [status, setStatus] =
    useState<ProjectStatus>("in_progress");

  const [currentPhase, setCurrentPhase] =
    useState<string>(PHASE_OPTIONS[0] ?? "");

  const [description, setDescription] = useState("");

  const [coverImage, setCoverImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  /*
   * Generate the project ID before uploading images.
   *
   * New project:
   *   projectId = new UUID
   *
   * Existing project:
   *   projectId = existing D1 project ID
   *
   * R2 structure:
   *   projects/{projectId}/cover.webp
   *   projects/{projectId}/gallery/{imageId}.webp
   */
  useEffect(() => {
    if (!isOpen) return;

    setErrorMessage(null);

    if (editingProject) {
      setProjectId(editingProject.id);
      setTitle(editingProject.title);
      setCategory(editingProject.category);
      setLocation(editingProject.location);
      setStatus(editingProject.status);
      setCurrentPhase(
        editingProject.current_phase || PHASE_OPTIONS[0] || ""
      );
      setDescription(editingProject.description || "");
      setCoverImage(editingProject.cover_image || "");
      setGalleryImages(editingProject.gallery_images || []);
    } else {
      setProjectId(crypto.randomUUID());
      setTitle("");
      setCategory(CATEGORY_OPTIONS[0] ?? "");
      setLocation("Ramanagara");
      setStatus("in_progress");
      setCurrentPhase(PHASE_OPTIONS[0] ?? "");
      setDescription("");
      setCoverImage("");
      setGalleryImages([]);
    }
  }, [isOpen, editingProject]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setErrorMessage(null);

    if (!projectId) {
      setErrorMessage(
        "Project ID could not be generated."
      );
      return;
    }

    if (!title.trim()) {
      setErrorMessage("Project title is required.");
      return;
    }

    if (!coverImage.trim()) {
      setErrorMessage(
        "Please upload a cover image."
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        category: category.trim(),
        location: location.trim(),
        status,

        current_phase:
          status === "in_progress"
            ? currentPhase
            : null,

        description:
          description.trim() || null,

        cover_image: coverImage,
        gallery_images: galleryImages,
      };

      /*
       * Existing project:
       *   editingProject.id
       *
       * New project:
       *   generated projectId
       *
       * The same ID is used for the R2 paths.
       */
      await onSave(
        payload,
        editingProject?.id
      );

      onClose();
    } catch (error) {
      console.error(
        "Project save error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to save project."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;

    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div className="relative flex max-h-[92vh] sm:max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-4 sm:py-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {editingProject
                ? "Edit Project"
                : "Add New Project"}
            </h2>

            <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
              {editingProject
                ? "Update project details and images."
                : "Add a new construction project."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto"
        >
          <div className="space-y-5 sm:space-y-6 p-4 sm:p-6">
            {/* Error */}
            {errorMessage && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Project Information */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">
                Project Information
              </h3>

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Project Title *
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="e.g. Modern Villa"
                  disabled={submitting}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
                />
              </div>

              {/* Category + Location */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category *
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    disabled={submitting}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100 font-medium"
                  >
                    {CATEGORY_OPTIONS.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Location *
                  </label>

                  <input
                    type="text"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    placeholder="e.g. Ramanagara"
                    disabled={submitting}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Project Status *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setStatus("in_progress")
                    }
                    disabled={submitting}
                    className={`rounded-lg border px-4 py-3 text-xs sm:text-sm font-semibold transition cursor-pointer ${status === "in_progress"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                      }`}
                  >
                    Work in Progress
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setStatus("completed")
                    }
                    disabled={submitting}
                    className={`rounded-lg border px-4 py-3 text-xs sm:text-sm font-semibold transition cursor-pointer ${status === "completed"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                      }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Current Phase */}
              {status === "in_progress" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Current Construction Phase *
                  </label>

                  <select
                    value={currentPhase}
                    onChange={(e) =>
                      setCurrentPhase(
                        e.target.value
                      )
                    }
                    disabled={submitting}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
                  >
                    {PHASE_OPTIONS.map(
                      (phase) => (
                        <option
                          key={phase}
                          value={phase}
                        >
                          {phase}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Describe the project..."
                  rows={4}
                  disabled={submitting}
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">
                  Project Images
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Upload a cover image and as many gallery images as needed.
                </p>
              </div>

              {/* Cover */}
              <ImageUploader
                value={coverImage}
                onChange={setCoverImage}
                projectId={projectId}
              />

              {/* Gallery */}
              <MultiImageUploader
                values={galleryImages}
                onChange={setGalleryImages}
                projectId={projectId}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 border-t border-slate-200 bg-white px-4 sm:px-6 py-3.5 sm:py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="w-full sm:w-auto justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto justify-center flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {submitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {submitting
                ? "Saving..."
                : editingProject
                  ? "Update Project"
                  : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}