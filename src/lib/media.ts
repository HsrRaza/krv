/**
 * Cloudflare Worker / R2 media utilities.
 *
 * Images are stored in R2 and referenced by object key.
 *
 * Examples:
 *
 * projects/<project-id>/cover.webp
 * projects/<project-id>/gallery/<image-id>.webp
 */

const WORKER_URL =
  process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || "";

export function getMediaUrl(objectKey: string): string {
  if (!objectKey || typeof objectKey !== "string") {
    return "";
  }

  // Already a complete URL.
  if (/^https?:\/\//i.test(objectKey)) {
    return objectKey;
  }

  if (!WORKER_URL) {
    console.error(
      "NEXT_PUBLIC_CLOUDFLARE_WORKER_URL is not configured."
    );

    return objectKey;
  }

  const encodedKey = objectKey
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return `${WORKER_URL.replace(/\/$/, "")}/media/${encodedKey}`;
}