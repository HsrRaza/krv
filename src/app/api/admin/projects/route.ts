import { NextResponse } from "next/server";
import { cloudflareRequest } from "@/lib/cloudflare-api";

interface CloudflareProject {
    id: string;
    title: string;
    status: "in_progress" | "completed";
    category: string;
    location: string;
    current_phase: string | null;
    description: string | null;
    created_at: string;
}

interface CloudflareImage {
    id: string;
    project_id: string;
    object_key: string;
    image_type: "cover" | "gallery";
    sort_order: number;
    created_at: string;
}

interface ProjectResponse {
    success: boolean;
    project: CloudflareProject;
}

interface ProjectsResponse {
    projects: CloudflareProject[];
}

interface ImagesResponse {
    images: CloudflareImage[];
}

interface ProjectInput {
    id?: string;
    title?: string;
    category?: string;
    location?: string;
    status?: "in_progress" | "completed";
    current_phase?: string | null;
    description?: string | null;
    cover_image?: string;
    gallery_images?: string[];
}

/**
 * Get all images belonging to a project.
 */
async function getProjectImages(
    projectId: string
): Promise<CloudflareImage[]> {
    const data = await cloudflareRequest<ImagesResponse>(
        `/projects/${projectId}/images`
    );

    return [...(data.images || [])].sort(
        (a, b) => a.sort_order - b.sort_order
    );
}

/**
 * Convert the D1 project + project_images records
 * into the Project shape expected by the frontend.
 */
async function buildProject(
    project: CloudflareProject
): Promise<Record<string, unknown>> {
    const images = await getProjectImages(project.id);

    const coverImage =
        images.find(
            (image) => image.image_type === "cover"
        )?.object_key || "";

    const galleryImages = images
        .filter(
            (image) => image.image_type === "gallery"
        )
        .map((image) => image.object_key);

    return {
        ...project,
        cover_image: coverImage,
        gallery_images: galleryImages,
    };
}

/**
 * Extract the gallery image ID from:
 *
 * projects/<projectId>/gallery/<imageId>.webp
 */
function extractGalleryImageId(
    objectKey: string
): string {
    const parts = objectKey.split("/");
    const filename =
        parts[parts.length - 1] || "";

    return (
        filename.replace(/\.[^/.]+$/, "") ||
        crypto.randomUUID()
    );
}

/**
 * Register one uploaded image in D1.
 */
async function registerImage(
    projectId: string,
    objectKey: string,
    imageType: "cover" | "gallery",
    sortOrder: number
) {
    if (!objectKey) {
        return;
    }

    const imageId =
        imageType === "cover"
            ? crypto.randomUUID()
            : extractGalleryImageId(objectKey);

    await cloudflareRequest(
        `/projects/${projectId}/images`,
        {
            method: "POST",
            body: JSON.stringify({
                id: imageId,
                object_key: objectKey,
                image_type: imageType,
                sort_order: sortOrder,
            }),
        }
    );
}

/**
 * Synchronize project_images with the images
 * currently selected by the frontend.
 */
async function syncProjectImages(
    projectId: string,
    coverImage: string,
    galleryImages: string[]
) {
    const existingImages =
        await getProjectImages(projectId);

    const desiredImages = new Map<
        string,
        {
            object_key: string;
            image_type: "cover" | "gallery";
            sort_order: number;
        }
    >();

    /*
     * Cover image always has sort_order 0.
     */
    if (coverImage) {
        desiredImages.set(coverImage, {
            object_key: coverImage,
            image_type: "cover",
            sort_order: 0,
        });
    }

    /*
     * Gallery images start at sort_order 1.
     */
    galleryImages.forEach(
        (objectKey, index) => {
            if (!objectKey) {
                return;
            }

            desiredImages.set(objectKey, {
                object_key: objectKey,
                image_type: "gallery",
                sort_order: index + 1,
            });
        }
    );

    /*
     * Delete database records for images that
     * are no longer selected.
     */
    for (const existingImage of existingImages) {
        if (
            !desiredImages.has(
                existingImage.object_key
            )
        ) {
            await cloudflareRequest(
                `/projects/${projectId}/images/${existingImage.id}`,
                {
                    method: "DELETE",
                }
            );
        }
    }

    /*
     * Refresh after deletions.
     */
    const remainingImages =
        await getProjectImages(projectId);

    /*
     * Register images that exist in the frontend
     * but don't yet exist in D1.
     */
    for (
        const [objectKey, desired] of desiredImages
    ) {
        const alreadyExists =
            remainingImages.some(
                (image) =>
                    image.object_key === objectKey
            );

        if (!alreadyExists) {
            await registerImage(
                projectId,
                objectKey,
                desired.image_type,
                desired.sort_order
            );
        }
    }
}

/**
 * GET all projects.
 */
export async function GET() {
    try {
        const data =
            await cloudflareRequest<ProjectsResponse>(
                "/projects"
            );

        const projects = await Promise.all(
            (data.projects || []).map(buildProject)
        );

        return NextResponse.json({
            projects,
        });
    } catch (err) {
        const message =
            err instanceof Error
                ? err.message
                : "Failed to fetch projects.";

        console.error(
            "[GET PROJECTS ERROR]",
            err
        );

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

/**
 * POST
 *
 * Creates a new project.
 *
 * IMPORTANT:
 * A supplied ID is treated as the ID for the
 * NEW project. We do NOT PATCH it.
 */
export async function POST(
    request: Request
) {
    try {
        const body =
            (await request.json()) as ProjectInput;

        const {
            id,
            title,
            category,
            location,
            status,
            current_phase,
            description,
            cover_image,
            gallery_images,
        } = body;

        if (
            !title ||
            !category ||
            !location ||
            !status
        ) {
            return NextResponse.json(
                {
                    error:
                        "Title, category, location, and status are required.",
                },
                { status: 400 }
            );
        }

        if (
            status !== "in_progress" &&
            status !== "completed"
        ) {
            return NextResponse.json(
                {
                    error:
                        "Invalid project status.",
                },
                { status: 400 }
            );
        }

        /*
         * Use the ID generated by ProjectModal.
         * If no ID was supplied, generate one here.
         *
         * This same ID is used by:
         *
         * D1:
         * projects.id
         *
         * R2:
         * projects/<projectId>/cover.webp
         *
         * R2 gallery:
         * projects/<projectId>/gallery/<imageId>.webp
         */
        const projectId =
            id || crypto.randomUUID();

        const payload = {
            id: projectId,
            title,
            category,
            location,
            status,
            current_phase:
                status === "in_progress"
                    ? current_phase ?? null
                    : null,
            description:
                description ?? null,
        };

        /*
         * STEP 1
         *
         * Create the project in D1.
         */
        const data =
            await cloudflareRequest<ProjectResponse>(
                "/projects",
                {
                    method: "POST",
                    body: JSON.stringify(
                        payload
                    ),
                }
            );

        const project = data.project;

        if (!project?.id) {
            throw new Error(
                "Cloudflare Worker did not return a project."
            );
        }

        /*
         * STEP 2
         *
         * Now that the D1 project exists,
         * register its uploaded images.
         */
        await syncProjectImages(
            project.id,
            cover_image || "",
            gallery_images || []
        );

        /*
         * STEP 3
         *
         * Return the complete project including
         * its image records.
         */
        const finalProject =
            await buildProject(project);

        return NextResponse.json({
            success: true,
            project: finalProject,
        });
    } catch (err) {
        console.error(
            "[CREATE PROJECT ERROR]",
            err
        );

        const message =
            err instanceof Error
                ? err.message
                : "Failed to save project.";

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

/**
 * PATCH
 *
 * Updates an existing project.
 */
export async function PATCH(
    request: Request
) {
    try {
        const body =
            (await request.json()) as ProjectInput;

        const {
            id,
            title,
            category,
            location,
            status,
            current_phase,
            description,
            cover_image,
            gallery_images,
        } = body;

        if (!id) {
            return NextResponse.json(
                {
                    error:
                        "Project ID is required.",
                },
                { status: 400 }
            );
        }

        if (
            status !== undefined &&
            status !== "in_progress" &&
            status !== "completed"
        ) {
            return NextResponse.json(
                {
                    error:
                        "Invalid project status.",
                },
                { status: 400 }
            );
        }

        const payload = {
            title,
            category,
            location,
            status,
            current_phase:
                status === "completed"
                    ? null
                    : current_phase,
            description,
        };

        const data =
            await cloudflareRequest<ProjectResponse>(
                `/projects/${id}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(
                        payload
                    ),
                }
            );

        const project = data.project;

        /*
         * Only synchronize images if image fields
         * were actually supplied.
         */
        if (
            cover_image !== undefined ||
            gallery_images !== undefined
        ) {
            await syncProjectImages(
                project.id,
                cover_image || "",
                gallery_images || []
            );
        }

        const finalProject =
            await buildProject(project);

        return NextResponse.json({
            success: true,
            project: finalProject,
        });
    } catch (err) {
        console.error(
            "[UPDATE PROJECT ERROR]",
            err
        );

        const message =
            err instanceof Error
                ? err.message
                : "Failed to update project.";

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

/**
 * DELETE
 *
 * Deletes the project and its associated
 * R2/D1 images.
 */
export async function DELETE(
    request: Request
) {
    try {
        const { searchParams } =
            new URL(request.url);

        const id =
            searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    error:
                        "Project ID is required.",
                },
                { status: 400 }
            );
        }

        await cloudflareRequest(
            `/projects/${id}`,
            {
                method: "DELETE",
            }
        );

        return NextResponse.json({
            success: true,
        });
    } catch (err) {
        console.error(
            "[DELETE PROJECT ERROR]",
            err
        );

        const message =
            err instanceof Error
                ? err.message
                : "Failed to delete project.";

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}