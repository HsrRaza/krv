import "server-only";

const WORKER_URL = process.env.CLOUDFLARE_WORKER_URL!;
const WORKER_SECRET = process.env.CLOUDFLARE_WORKER_SECRET!;

if (!WORKER_URL) {
  throw new Error("CLOUDFLARE_WORKER_URL is not configured");
}

if (!WORKER_SECRET) {
  throw new Error("CLOUDFLARE_WORKER_SECRET is not configured");
}

export async function cloudflareRequest<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${WORKER_SECRET}`);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${WORKER_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as T & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error || "Cloudflare API request failed");
  }

  return data;
}