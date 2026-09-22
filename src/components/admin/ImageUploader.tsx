"use client";

import { useState } from "react";
import {
  Upload,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { getMediaUrl } from "@/lib/media";

interface ImageUploaderProps {
  value: string;
  onChange: (objectKey: string) => void;
  label?: string;
  canUpload?: boolean;
  projectId: string;
}

interface UploadResponse {
  success?: boolean;
  error?: string;
  object_key?: string;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES =
  MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Convert JPG / PNG / WebP to WebP in the browser.
 */
async function convertToWebP(
  file: File
): Promise<Blob> {
  if (file.type === "image/webp") {
    return file;
  }

  if (
    !["image/jpeg", "image/jpg", "image/png"].includes(
      file.type
    )
  ) {
    throw new Error(
      "Only JPG, PNG, and WEBP images are supported."
    );
  }

  const bitmap = await createImageBitmap(file);

  const canvas = document.createElement("canvas");

  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close();

    throw new Error(
      "Could not process the selected image."
    );
  }

  context.drawImage(bitmap, 0, 0);

  bitmap.close();

  const webpBlob = await new Promise<Blob | null>(
    (resolve) => {
      canvas.toBlob(
        resolve,
        "image/webp",
        0.82
      );
    }
  );

  if (!webpBlob) {
    throw new Error(
      "Failed to convert image to WebP."
    );
  }

  return webpBlob;
}

/**
 * Upload the converted image to our Next.js API.
 */
async function uploadImage(
  file: Blob,
  projectId: string
): Promise<string> {
  const formData = new FormData();

  formData.append(
    "file",
    file,
    "cover.webp"
  );

  const imageId = crypto.randomUUID();
  const objectKey = `projects/${projectId}/cover-${imageId}.webp`;

  formData.append(
    "object_key",
    objectKey
  );

  const response = await fetch(
    "/api/admin/media",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = (await response.json()) as UploadResponse;

  if (!response.ok || !data.success || !data.object_key) {
    throw new Error(
      data.error || "Failed to upload image."
    );
  }

  return data.object_key;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Cover Image (Max 5MB)",
  canUpload = true,
  projectId,
}: ImageUploaderProps) {
  const [uploading, setUploading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setErrorMessage(null);

    /*
     * A project ID is required because the R2
     * object is stored inside the project folder.
     */
    if (!projectId) {
      setErrorMessage(
        "Project ID is missing. Please close and reopen the project form."
      );

      e.target.value = "";

      return;
    }

    if (!canUpload) {
      setErrorMessage(
        "This project already has the maximum number of images. Remove an image before changing the cover."
      );

      e.target.value = "";

      return;
    }

    /*
     * Validate the original file before processing.
     */
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        `File size exceeds the ${MAX_FILE_SIZE_MB}MB maximum limit.`
      );

      e.target.value = "";

      return;
    }

    if (
      ![
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setErrorMessage(
        "Only JPG, PNG, and WEBP images are supported."
      );

      e.target.value = "";

      return;
    }

    setUploading(true);

    try {
      /*
       * Convert JPG/PNG → WebP in the browser.
       */
      const webpBlob =
        await convertToWebP(file);

      /*
       * Upload WebP to Next.js.
       * Next.js forwards it to the Cloudflare Worker,
       * which stores it in R2.
       */
      const objectKey =
        await uploadImage(
          webpBlob,
          projectId
        );

      /*
       * Store the R2 object key in the parent.
       *
       * Example:
       * projects/abc-123/cover.webp
       */
      onChange(objectKey);
    } catch (err: unknown) {
      console.error(
        "R2 cover image upload error:",
        err
      );

      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to upload image."
      );
    } finally {
      setUploading(false);

      /*
       * Allow selecting the same file again.
       */
      e.target.value = "";
    }
  };

  const handleRemove = () => {
    /*
     * At this stage this only removes the image
     * from the modal state.
     *
     * We will add actual R2 deletion when we migrate
     * the complete project image lifecycle.
     */
    onChange("");

    setErrorMessage(null);
  };

  const previewUrl = getMediaUrl(value);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label} *
      </label>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between animate-shake">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />

            <span>{errorMessage}</span>
          </div>

          <button
            type="button"
            onClick={() =>
              setErrorMessage(null)
            }
            className="text-rose-600 hover:text-rose-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {value && previewUrl ? (
        <div className="relative group w-full h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
          <img
            src={previewUrl}
            alt="Cover Preview"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />

          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            <label className="px-3.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold cursor-pointer shadow hover:bg-stone-100 transition flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-amber-600" />

              <span>Change Image</span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="p-2 rounded-xl bg-rose-600 text-white shadow hover:bg-rose-700 transition disabled:opacity-50"
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

              <span className="text-xs font-bold">
                Converting & uploading to R2...
              </span>
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
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

