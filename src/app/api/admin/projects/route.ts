import { NextResponse } from "next/server";
import { createClient as createSupabaseDirectClient } from "@supabase/supabase-js";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

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

    const supabase = (await getSupabaseClient()) as any;

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

    const supabase = (await getSupabaseClient()) as any;
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
    const id = searchParams.get("id");

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
