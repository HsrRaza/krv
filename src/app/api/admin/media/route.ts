import { NextResponse } from "next/server";
import { cloudflareRequest } from "@/lib/cloudflare-api";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const objectKey = formData.get("object_key");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "File is required.",
        },
        { status: 400 }
      );
    }

    if (typeof objectKey !== "string" || !objectKey.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "object_key is required.",
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "File is empty.",
        },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();

    const data = await cloudflareRequest<{
      success: boolean;
      object_key: string;
    }>(
      `/media/${encodeURIComponent(objectKey)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: buffer,
      }
    );

    return NextResponse.json({
      success: true,
      object_key: data.object_key,
    });
  } catch (error) {
    console.error("Cloudflare media upload error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload media.",
      },
      { status: 500 }
    );
  }
}
