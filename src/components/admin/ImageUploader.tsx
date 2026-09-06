"use client";

import { useState } from "react";
import {
  uploadToCloudinary,
  getOptimizedImageUrl,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from "@/lib/cloudinary";
import { Upload, X, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  canUpload?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Cover Image (Max 5MB)",
  canUpload = true,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);

    if (!canUpload) {
      setErrorMessage("This project already has the maximum of 20 images. Remove an image before changing the cover.");
      e.target.value = "";
      return;
    }

    // Enforce 5MB size limit check before network upload
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File size exceeds the ${MAX_FILE_SIZE_MB}MB maximum limit.`);
      // Reset input value
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const secureUrl = await uploadToCloudinary(file);
      onChange(secureUrl);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    setErrorMessage(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label} *
      </label>

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between animate-shake">
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

      {value ? (
        <div className="relative group w-full h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
          <img
            src={getOptimizedImageUrl(value, 600)}
            alt="Cover Preview"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            <label className="px-3.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold cursor-pointer shadow hover:bg-stone-100 transition flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
              <span>Change Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-xl bg-rose-600 text-white shadow hover:bg-rose-700 transition"
              title="Remove Cover Image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 hover:border-amber-600 rounded-2xl cursor-pointer bg-stone-50 hover:bg-amber-50/20 transition">
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-amber-700">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-bold">Uploading directly to Cloudinary...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-slate-500">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-1">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">
                Click or drag image here
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                JPG, PNG, WEBP • Enforced 5MB Maximum Cap
              </span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
