import { NextResponse } from "next/server";
import { cloudflareRequest } from "@/lib/cloudflare-api";

type RouteContext = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { projectId } = await params;

    const data = await cloudflareRequest(
      `/projects/${encodeURIComponent(projectId)}/images`
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Cloudflare project images GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch project images.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { projectId } = await params;
    const body = await request.json();

    const data = await cloudflareRequest(
      `/projects/${encodeURIComponent(projectId)}/images`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(
      "Cloudflare project image registration error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to register project image.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { projectId } = await params;
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        {
          success: false,
          error: "imageId is required.",
        },
        { status: 400 }
      );
    }

    const data = await cloudflareRequest(
      `/projects/${encodeURIComponent(projectId)}/images/${encodeURIComponent(
        imageId
      )}`,
      {
        method: "DELETE",
      }
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Cloudflare project image DELETE error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete project image.",
      },
      { status: 500 }
    );
  }
}
