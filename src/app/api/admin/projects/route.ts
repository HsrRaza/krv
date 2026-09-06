import { NextResponse } from "next/server";
import { createClient as createSupabaseDirectClient } from "@supabase/supabase-js";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { MAX_PROJECT_IMAGES, MAX_SECTION_IMAGES } from "@/lib/cloudinary";

async function getSupabaseClient() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createSupabaseDirectClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );
  }
  return await createSupabaseServerClient();
}

function getImageCount(coverImage: unknown, galleryImages: unknown) {
  const coverCount = typeof coverImage === "string" && coverImage.trim() ? 1 : 0;
  const galleryCount = Array.isArray(galleryImages)
    ? galleryImages.filter((url) => typeof url === "string" && url.trim()).length
    : 0;
  return coverCount + galleryCount;
}

function getSectionImageCount(projects: any[], status: string, excludedId?: string) {
  return projects
    .filter((project) => project.status === status && project.id !== excludedId)
    .reduce(
      (total, project) => total + getImageCount(project.cover_image, project.gallery_images),
      0
    );
}

// GET all projects
export async function GET() {
  try {
    const supabase = (await getSupabaseClient()) as any;
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ projects: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch projects." },
      { status: 500 }
    );
  }
}

// POST: Create new project or Update existing project if id is provided
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, category, location, status, current_phase, description, cover_image, gallery_images } = body;

    if (!Array.isArray(gallery_images)) {
      return NextResponse.json({ error: "Gallery images must be an array." }, { status: 400 });
    }
    if (getImageCount(cover_image, gallery_images) > MAX_PROJECT_IMAGES) {
      return NextResponse.json(
        { error: `A project can contain a maximum of ${MAX_PROJECT_IMAGES} images including the cover.` },
        { status: 400 }
      );
    }

    const supabase = (await getSupabaseClient()) as any;
    const { data: existingProjects, error: existingProjectsError } = await supabase
      .from("projects")
      .select("id, status, cover_image, gallery_images");

    if (existingProjectsError) {
      return NextResponse.json({ error: existingProjectsError.message }, { status: 400 });
    }

    if (
      getSectionImageCount(existingProjects || [], status, id) +
        getImageCount(cover_image, gallery_images) >
      MAX_SECTION_IMAGES
    ) {
      return NextResponse.json(
        {
          error: `The ${status === "completed" ? "gallery" : "work in progress"} section is limited to ${MAX_SECTION_IMAGES} images. Delete existing images before uploading more.`,
        },
        { status: 400 }
      );
    }

    if (id) {
      // Update existing project
      const { data, error } = await supabase
        .from("projects")
        .update({
          title,
          category,
          location,
          status,
          current_phase: status === "in_progress" ? current_phase : null,
          description,
          cover_image,
          gallery_images: gallery_images || [],
        })
        .eq("id", id)
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, project: data ? data[0] : null });
    } else {
      // Create new project
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            title,
            category,
            location,
            status,
            current_phase: status === "in_progress" ? current_phase : null,
            description,
            cover_image,
            gallery_images: gallery_images || [],
          },
        ])
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, project: data ? data[0] : null });
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to save project." },
      { status: 500 }
    );
  }
}

// PATCH: Partial update (status toggle, current_phase, gallery_images)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Project ID is required." }, { status: 400 });
    }

    if ("gallery_images" in updates) {
      if (!Array.isArray(updates.gallery_images)) {
        return NextResponse.json({ error: "Gallery images must be an array." }, { status: 400 });
      }
      if (updates.gallery_images.length > MAX_PROJECT_IMAGES - 1) {
        return NextResponse.json(
          { error: `A project can contain a maximum of ${MAX_PROJECT_IMAGES} images including the cover.` },
          { status: 400 }
        );
      }
    }

    const supabase = (await getSupabaseClient()) as any;
    const { data: existingProject, error: existingProjectError } = await supabase
      .from("projects")
      .select("id, status, cover_image, gallery_images")
      .eq("id", id)
      .maybeSingle();

    if (existingProjectError || !existingProject) {
      return NextResponse.json(
        { error: existingProjectError?.message || "Project not found." },
        { status: 404 }
      );
    }

    const nextStatus = typeof updates.status === "string" ? updates.status : existingProject.status;
    const nextCoverImage = "cover_image" in updates ? updates.cover_image : existingProject.cover_image;
    const nextGalleryImages = "gallery_images" in updates ? updates.gallery_images : existingProject.gallery_images;
    const { data: allProjects, error: allProjectsError } = await supabase
      .from("projects")
      .select("id, status, cover_image, gallery_images");

    if (allProjectsError) {
      return NextResponse.json({ error: allProjectsError.message }, { status: 400 });
    }

    if (
      getSectionImageCount(allProjects || [], nextStatus, id) +
        getImageCount(nextCoverImage, nextGalleryImages) >
      MAX_SECTION_IMAGES
    ) {
      return NextResponse.json(
        {
          error: `The ${nextStatus === "completed" ? "gallery" : "work in progress"} section is limited to ${MAX_SECTION_IMAGES} images. Delete existing images before uploading more.`,
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, project: data ? data[0] : null });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update project." },
      { status: 500 }
    );
  }
}

// DELETE: Delete project by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const body = await request.json().catch(() => ({}));
    const id = searchParams.get("id") || body.id;

    if (!id) {
      return NextResponse.json({ error: "Project ID is required." }, { status: 400 });
    }

    const supabase = (await getSupabaseClient()) as any;
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete project." },
      { status: 500 }
    );
  }
}
