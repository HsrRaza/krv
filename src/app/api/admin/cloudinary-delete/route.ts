import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/lib/supabase/server";
import { getPublicIdFromUrl } from "@/lib/cloudinary";

// Initialize Cloudinary SDK with private credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Simple in-memory sliding window rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  record.count += 1;
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

const PUBLIC_ID_REGEX = /^[a-zA-Z0-9_\-\/]+$/;

async function checkAuth(request: Request): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieHeader = request.headers.get("cookie") || "";
  const hasAdminCookie = cookieHeader.includes("krv_admin_session=true");

  return !!(user || hasAdminCookie);
}

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 2. Authentication Verification
    const isAuthenticated = await checkAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    // 3. Request Body Parsing & Sanitization
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const { url, urls, public_id, public_ids } = body as {
      url?: unknown;
      urls?: unknown;
      public_id?: unknown;
      public_ids?: unknown;
    };

    const rawIds: string[] = [];

    if (typeof public_id === "string" && public_id.trim()) {
      rawIds.push(public_id.trim());
    }

    if (Array.isArray(public_ids)) {
      public_ids.forEach((id) => {
        if (typeof id === "string" && id.trim()) {
          rawIds.push(id.trim());
        }
      });
    }

    if (typeof url === "string" && url.trim()) {
      const parsedId = getPublicIdFromUrl(url.trim());
      if (parsedId) rawIds.push(parsedId);
    }

    if (Array.isArray(urls)) {
      urls.forEach((u) => {
        if (typeof u === "string" && u.trim()) {
          const parsedId = getPublicIdFromUrl(u.trim());
          if (parsedId) rawIds.push(parsedId);
        }
      });
    }

    // Filter and sanitize: must match PUBLIC_ID_REGEX to prevent injection / path traversal
    const sanitizedIds = Array.from(new Set(rawIds)).filter((id) =>
      PUBLIC_ID_REGEX.test(id)
    );

    if (sanitizedIds.length === 0) {
      return NextResponse.json(
        { error: "No valid, sanitized Cloudinary public_ids provided." },
        { status: 400 }
      );
    }

    // 4. Delete assets via Cloudinary SDK
    const results = await Promise.all(
      sanitizedIds.map((id) =>
        cloudinary.uploader.destroy(id).catch((err) => ({
          public_id: id,
          error: err.message,
        }))
      )
    );

    const failedResults = results.filter((result) => "error" in result);
    if (failedResults.length > 0) {
      return NextResponse.json(
        {
          error: "One or more Cloudinary assets could not be deleted.",
          deleted_ids: sanitizedIds.filter(
            (id) => !failedResults.some((result) => result.public_id === id)
          ),
          results,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      deleted_ids: sanitizedIds,
      results,
    });
  } catch (error: any) {
    console.error("Error deleting asset from Cloudinary:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete Cloudinary asset." },
      { status: 500 }
    );
  }
}

// Method handling for unsupported HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

