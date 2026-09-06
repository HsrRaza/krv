/**
 * Cloudinary direct-to-cloud upload helper & utilities.
 * Enforces a strict 5MB file cap client-side to prevent unwanted bandwidth & server load.
 */

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit
export const MAX_FILE_SIZE_MB = 5;
export const MAX_PROJECT_IMAGES = 20;
export const MAX_SECTION_IMAGES = 20;

export async function uploadToCloudinary(file: File): Promise<string> {
  // 1. Enforce 5MB File Cap before any network request
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size exceeds the ${MAX_FILE_SIZE_MB}MB maximum limit.`);
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary environment variables NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET are missing."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || "Failed to upload image to Cloudinary."
    );
  }

  const data = await response.json();
  return data.secure_url;
}

/**
 * Returns a Cloudinary image URL optimized with dynamic width, auto format, and auto quality.
 */
export function getOptimizedImageUrl(url: string, width = 800): string {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("cloudinary.com") || !url.includes("/upload/")) return url;

  // Insert width, auto format, and auto quality parameters after /upload/
  return url.replace("/upload/", `/upload/w_${width},f_auto,q_auto/`);
}

/**
 * Extracts public_id from a Cloudinary delivery URL.
 * e.g., https://res.cloudinary.com/cloudname/image/upload/v12345/folder/sample.jpg => folder/sample
 */
export function getPublicIdFromUrl(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("cloudinary.com")) return null;

  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    const postUpload = parts[1];
    // Strip version prefix if present (e.g. v167890123/)
    const withoutVersion = postUpload.replace(/^v\d+\//, "");
    // Remove file extension
    const lastDotIndex = withoutVersion.lastIndexOf(".");
    if (lastDotIndex === -1) return withoutVersion;
    return withoutVersion.substring(0, lastDotIndex);
  } catch (error) {
    console.error("Error parsing public_id from Cloudinary URL:", error);
    return null;
  }
}
