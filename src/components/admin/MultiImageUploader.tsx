"use client";

import { useState } from "react";
import { uploadToCloudinary, getOptimizedImageUrl, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from "@/lib/cloudinary";
import { Image as ImageIcon, X, Loader2, AlertCircle } from "lucide-react";

interface MultiImageUploaderProps {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export default function MultiImageUploader({
  values,
  onChange,
  label = "Gallery Photos (Site Progress Shots)",
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMessage(null);
    const fileList = Array.from(files);

    // Validate that no single file exceeds 5MB
    const oversized = fileList.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
    if (oversized.length > 0) {
      setErrorMessage(
        `File "${oversized[0].name}" exceeds the ${MAX_FILE_SIZE_MB}MB maximum limit.`
      );
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = fileList.map((file) => uploadToCloudinary(file));
      const newUrls = await Promise.all(uploadPromises);
      onChange([...values, ...newUrls]);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload gallery images.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (indexToRemove: number) => {
    const urlToRemove = values[indexToRemove];

    // Purge from Cloudinary via API
    try {
      fetch("/api/admin/cloudinary-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToRemove }),
      }).catch((err) => console.error("Cloudinary purge error:", err));
    } catch (e) {
      console.error(e);
    }

    // Update parent state immediately
    const updated = values.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label}
      </label>

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-600 hover:text-rose-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Selector Trigger Button */}
      <label className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 bg-stone-50 hover:bg-amber-50/30 cursor-pointer text-xs font-bold text-slate-700 transition">
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
            <span>Uploading images directly to Cloudinary...</span>
          </>
        ) : (
          <>
            <ImageIcon className="w-4 h-4 text-amber-600" />
            <span>Select Multiple Photos (Max 5MB each)</span>
          </>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFilesChange}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {/* Thumbnail Grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
          {values.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm group bg-slate-900"
            >
              <img
                src={getOptimizedImageUrl(imgUrl, 300)}
                alt={`Gallery ${idx}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 shadow transition"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
