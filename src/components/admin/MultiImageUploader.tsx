"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";
import { getMediaUrl } from "@/lib/media";

interface MultiImageUploaderProps {
  values: string[];
  onChange: (values: string[]) => void;
  label?: string;
  projectId: string;

  // Kept for compatibility with the existing ProjectModal.
  // Gallery uploader does not use this value.
  coverImage?: string;
}

interface UploadingImage {
  id: string;
  name: string;
  progress: number;
}

interface UploadResponse {
  object_key?: string;
  error?: string;
}



async function convertToWebP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Could not create canvas context"));
        return;
      }

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      context.drawImage(image, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not convert image to WebP"));
            return;
          }

          resolve(blob);
        },
        "image/webp",
        0.8
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load image"));
    };

    image.src = objectUrl;
  });
}

async function uploadImageToR2(
  file: File,
  projectId: string,
  imageId: string
): Promise<string> {
  const webpBlob = await convertToWebP(file);

  const objectKey = `projects/${projectId}/gallery/${imageId}.webp`;

  const formData = new FormData();

  formData.append(
    "file",
    new File([webpBlob], `${imageId}.webp`, {
      type: "image/webp",
    })
  );

  formData.append("object_key", objectKey);

  const response = await fetch("/api/admin/media", {
    method: "POST",
    body: formData,
  });

  const data = (await response
    .json()
    .catch(() => ({}))) as UploadResponse;

  if (!response.ok) {
    throw new Error(data.error || "Failed to upload image");
  }

  return data.object_key || objectKey;
}

export default function MultiImageUploader({
  values,
  onChange,
  label = "Gallery Images",
  projectId,
  coverImage: _coverImage,
}: MultiImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState<UploadingImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isUploading = uploading.length > 0;

  const handleSelectFiles = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    setError(null);

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setError(`${file.name} is not an image.`);
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} is larger than 5MB.`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) {
      event.target.value = "";
      return;
    }

    const uploadItems: UploadingImage[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      progress: 0,
    }));

    setUploading(uploadItems);

    try {
      const uploadedKeys: string[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const uploadItem = uploadItems[i];

        setUploading((current) =>
          current.map((item) =>
            item.id === uploadItem.id
              ? {
                  ...item,
                  progress: 25,
                }
              : item
          )
        );

        const objectKey = await uploadImageToR2(
          file,
          projectId,
          uploadItem.id
        );

        uploadedKeys.push(objectKey);

        setUploading((current) =>
          current.map((item) =>
            item.id === uploadItem.id
              ? {
                  ...item,
                  progress: 100,
                }
              : item
          )
        );
      }

      onChange([...values, ...uploadedKeys]);
    } catch (err) {
      console.error("Gallery upload error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload gallery images."
      );
    } finally {
      setTimeout(() => {
        setUploading([]);
      }, 500);
    }

    event.target.value = "";
  };

  const handleRemoveImage = (objectKey: string) => {
    const updatedValues = values.filter((value) => value !== objectKey);

    onChange(updatedValues);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900">
          {label}
        </label>

        {values.length > 0 && (
          <span className="text-xs text-gray-500">
            {values.length} image{values.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleSelectFiles}
        disabled={isUploading || !projectId}
        className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <Loader2 className="mb-2 h-8 w-8 animate-spin text-gray-500" />

            <span className="text-sm font-medium text-gray-700">
              Uploading images...
            </span>

            <span className="mt-1 text-xs text-gray-500">
              Please wait
            </span>
          </>
        ) : (
          <>
            <ImagePlus className="mb-2 h-8 w-8 text-gray-500" />

            <span className="text-sm font-medium text-gray-700">
              Click to upload gallery images
            </span>

            <span className="mt-1 text-xs text-gray-500">
              JPG, PNG or WebP • Maximum 5MB per image
            </span>

            <span className="mt-1 text-xs text-gray-500">
              You can upload as many images as needed
            </span>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((item) => (
            <div
              key={item.id}
              className="rounded-md border border-gray-200 bg-white p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="max-w-[70%] truncate text-sm text-gray-700">
                  {item.name}
                </span>

                <span className="text-xs text-gray-500">
                  {item.progress}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gray-900 transition-all duration-300"
                  style={{
                    width: `${item.progress}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {values.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {values.map((objectKey, index) => {
            const imageUrl = getMediaUrl(objectKey);

            return (
              <div
                key={objectKey}
                className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
              >
                <Image
                  src={imageUrl}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                  unoptimized
                />

                <button
                  type="button"
                  onClick={() => handleRemoveImage(objectKey)}
                  disabled={isUploading}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition hover:bg-black disabled:cursor-not-allowed group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {values.length === 0 && !isUploading && (
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-8">
          <div className="text-center">
            <Upload className="mx-auto mb-2 h-6 w-6 text-gray-400" />

            <p className="text-sm text-gray-500">
              No gallery images added yet
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
