"use client";

import { useState } from "react";
import { Project } from "@/types/database";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (project: Project) => Promise<void>;
}

export default function DeleteConfirmModal({
  project,
  isOpen,
  onClose,
  onConfirmDelete,
}: DeleteConfirmModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !project) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirmDelete(project);
      onClose();
    } catch (err: any) {
      alert(`Deletion Failed: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const assetCount = 1 + (project.gallery_images?.length || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <button
            onClick={onClose}
            disabled={deleting}
            className="p-1.5 rounded-xl bg-stone-100 text-slate-500 hover:text-slate-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Delete Project Record?
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            You are about to delete <strong className="text-slate-900">&quot;{project.title}&quot;</strong>.
          </p>
          <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div>
              • <strong>Database Row:</strong> Will be purged from Supabase.
            </div>
            <div>
              • <strong>Cloudinary Pipeline:</strong> Will purge <strong>{assetCount} associated media asset(s)</strong>.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-stone-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition flex items-center gap-2 disabled:opacity-50"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Purging Cloudinary Assets...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Permanently Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
