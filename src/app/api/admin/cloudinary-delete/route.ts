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

export async function POST(request: Request) {
  try {
    // 1. Verify caller authentication via Supabase or admin cookie
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const cookieHeader = request.headers.get("cookie") || "";
    const hasAdminCookie = cookieHeader.includes("krv_admin_session=true");

    if (!user && !hasAdminCookie) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    // 2. Parse request payload (accepts single string or array of URLs / public_ids)
    const body = await request.json();
    const { url, urls, public_id, public_ids } = body as {
      url?: string;
      urls?: string[];
      public_id?: string;
      public_ids?: string[];
    };

    const idsToDelete: string[] = [];

    if (public_id && typeof public_id === "string") {
      idsToDelete.push(public_id);
    }

    if (public_ids && Array.isArray(public_ids)) {
      idsToDelete.push(...public_ids);
    }

    if (url && typeof url === "string") {
      const parsedId = getPublicIdFromUrl(url);
      if (parsedId) idsToDelete.push(parsedId);
    }

    if (urls && Array.isArray(urls)) {
      urls.forEach((u) => {
        const parsedId = getPublicIdFromUrl(u);
        if (parsedId) idsToDelete.push(parsedId);
      });
    }

    // Deduplicate public IDs
    const uniqueIds = Array.from(new Set(idsToDelete));

    if (uniqueIds.length === 0) {
      return NextResponse.json(
        { message: "No valid Cloudinary assets to delete." },
        { status: 400 }
      );
    }

    // 3. Delete assets from Cloudinary
    const results = await Promise.all(
      uniqueIds.map((id) =>
        cloudinary.uploader.destroy(id).catch((err) => ({
          public_id: id,
          error: err.message,
        }))
      )
    );

    return NextResponse.json({
      success: true,
      deleted_ids: uniqueIds,
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
