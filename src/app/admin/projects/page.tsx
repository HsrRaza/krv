"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { Project, ProjectStatus } from "@/types/database";
import ProjectModal from "@/components/admin/ProjectModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import {
  Building2,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  FolderKanban,
  Loader2,
  Search,
} from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>("all");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Deletion Modal State
  const [deleteTargetProject, setDeleteTargetProject] = useState<Project | null>(null);

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
        setProjects(json.projects);
      } else {
        console.error("Error fetching projects:", json.error);
      }
    } catch (e) {
      console.error("Error fetching projects:", e);
    }
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  // Save (Create or Update) Project
  const handleSaveProject = async (payload: any, editingId?: string) => {
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "Failed to save project.");
    }

    fetchProjects();
  };

  // Toggle Status (in_progress <-> completed)
  const handleToggleStatus = async (project: Project) => {
    const newStatus: ProjectStatus =
      project.status === "in_progress" ? "completed" : "in_progress";
    const newPhase =
      newStatus === "in_progress" ? "Site Excavation & Earthwork" : null;

    const res = await fetch("/api/admin/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: project.id,
        status: newStatus,
        current_phase: newPhase,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      alert(`Failed to toggle status: ${json.error}`);
    } else {
      fetchProjects();
    }
  };

  // Delete Project with Cloudinary Cleanup Pipeline
  const handleConfirmDelete = async (project: Project) => {
    // 1. Collect target image URLs
    const urlsToDelete = [project.cover_image, ...(project.gallery_images || [])].filter(Boolean);

    // 2. Trigger Cloudinary Purge via protected API route
    if (urlsToDelete.length > 0) {
      const purgeResponse = await fetch("/api/admin/cloudinary-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urlsToDelete }),
      });

      if (!purgeResponse.ok) {
        const errJson = await purgeResponse.json().catch(() => ({}));
        console.warn("Cloudinary asset purge returned error:", errJson);
      }
    }

    // 3. Delete database record via API
    const res = await fetch(`/api/admin/projects?id=${project.id}`, {
      method: "DELETE",
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "Failed to delete project record.");
    }

    fetchProjects();
  };

  // Metrics Calculations
  const totalProjects = projects.length;
  const inProgressCount = projects.filter((p) => p.status === "in_progress").length;
  const completedCount = projects.filter((p) => p.status === "completed").length;
  const totalGalleryAssets = projects.reduce(
    (acc, p) => acc + 1 + (p.gallery_images?.length || 0),
    0
  );

  // Filtered List
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Metrics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Projects
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{totalProjects}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Work In Progress
            </span>
            <div className="text-3xl font-extrabold text-amber-600 mt-1">{inProgressCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Completed Sites
            </span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1">{completedCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cloudinary Assets
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{totalGalleryAssets}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control Bar & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, category, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-slate-200">
            {(["all", "in_progress", "completed"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                  statusFilter === filter
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {filter === "all" ? "All" : filter.replace("_", " ")}
              </button>
            ))}
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 transition flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            <span className="text-sm font-medium">Fetching projects from Supabase...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-3">
            <FolderKanban className="w-12 h-12 text-slate-300" />
            <div className="text-base font-bold text-slate-800">No Projects Found</div>
            <p className="text-xs text-slate-500">Create a new project or adjust your search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Cover</th>
                  <th className="py-4 px-6">Project & Location</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Status & Phase</th>
                  <th className="py-4 px-6 text-center">Gallery</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-4 px-6">
                      <img
                        src={getOptimizedImageUrl(project.cover_image, 200)}
                        alt={project.title}
                        className="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-sm bg-slate-900"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{project.title}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                        📍 {project.location}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700">
                      <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs">
                        {project.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1 items-start">
                        <button
                          onClick={() => handleToggleStatus(project)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition shadow-sm ${
                            project.status === "in_progress"
                              ? "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                          }`}
                          title="Click to toggle status"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              project.status === "in_progress"
                                ? "bg-amber-500 animate-pulse"
                                : "bg-emerald-500"
                            }`}
                          />
                          <span>{project.status === "in_progress" ? "In Progress" : "Completed"}</span>
                        </button>
                        {project.status === "in_progress" && project.current_phase && (
                          <span className="text-[11px] font-semibold text-slate-600 bg-stone-100 px-2 py-0.5 rounded border border-slate-200">
                            Phase: {project.current_phase}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-700">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-lg text-xs">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                        {project.gallery_images?.length || 0} photos
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetProject(project)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
                          title="Delete Project & Cloudinary Assets"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Project Create / Edit Form Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        editingProject={editingProject}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
      />

      {/* Project Deletion Confirmation Dialog */}
      <DeleteConfirmModal
        project={deleteTargetProject}
        isOpen={!!deleteTargetProject}
        onClose={() => setDeleteTargetProject(null)}
        onConfirmDelete={handleConfirmDelete}
      />
    </main>
  );
}
