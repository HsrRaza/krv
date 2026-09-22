/* eslint-disable import/no-anonymous-default-export */

/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  API_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);

      const isWriteRequest =
        request.method === "POST" ||
        request.method === "PATCH" ||
        request.method === "PUT" ||
        request.method === "DELETE";

      // Protect all write operations with API secret.
      if (isWriteRequest) {
        const authorization = request.headers.get("authorization");
        const expected = `Bearer ${env.API_SECRET}`;

        if (authorization !== expected) {
          return Response.json(
            {
              success: false,
              error: "Unauthorized",
            },
            { status: 401 }
          );
        }
      }

      // ============================================================
      // GET /projects
      // ============================================================
      if (request.method === "GET" && url.pathname === "/projects") {
        const { results } = await env.DB.prepare(`
          SELECT
            id,
            title,
            status,
            category,
            location,
            current_phase,
            description,
            created_at
          FROM projects
          ORDER BY created_at DESC
        `).all();

        return Response.json({
          success: true,
          projects: results,
        });
      }

      // ============================================================
      // POST /projects
      // Create or Upsert a project
      // ============================================================
      if (request.method === "POST" && url.pathname === "/projects") {
        const body = await request.json<{
          id?: string;
          title: string;
          status: string;
          category: string;
          location: string;
          current_phase?: string | null;
          description?: string | null;
        }>();

        const id = body.id ?? crypto.randomUUID();

        // Check if project with this ID already exists (upsert safety)
        const existing = await env.DB
          .prepare("SELECT id FROM projects WHERE id = ?")
          .bind(id)
          .first();

        const currentPhase =
          body.status === "in_progress"
            ? body.current_phase ?? null
            : null;

        if (existing) {
          // Update existing project
          await env.DB.prepare(`
            UPDATE projects
            SET
              title = ?,
              status = ?,
              category = ?,
              location = ?,
              current_phase = ?,
              description = ?
            WHERE id = ?
          `)
            .bind(
              body.title,
              body.status,
              body.category,
              body.location,
              currentPhase,
              body.description ?? null,
              id
            )
            .run();
        } else {
          // Insert new project
          await env.DB.prepare(`
            INSERT INTO projects (
              id,
              title,
              status,
              category,
              location,
              current_phase,
              description
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `)
            .bind(
              id,
              body.title,
              body.status,
              body.category,
              body.location,
              currentPhase,
              body.description ?? null
            )
            .run();
        }

        const project = await env.DB
          .prepare(`
            SELECT
              id,
              title,
              status,
              category,
              location,
              current_phase,
              description,
              created_at
            FROM projects
            WHERE id = ?
          `)
          .bind(id)
          .first();

        return Response.json(
          {
            success: true,
            project,
          },
          { status: existing ? 200 : 201 }
        );
      }

      // ============================================================
      // PATCH /projects/:id
      // Update project
      // ============================================================
      if (
        request.method === "PATCH" &&
        url.pathname.startsWith("/projects/") &&
        !url.pathname.includes("/images")
      ) {
        const id = url.pathname.split("/")[2];

        if (!id) {
          return Response.json(
            {
              success: false,
              error: "Project ID is required",
            },
            { status: 400 }
          );
        }

        const body = await request.json<{
          title?: string;
          status?: string;
          category?: string;
          location?: string;
          current_phase?: string | null;
          description?: string | null;
        }>();

        const existing = await env.DB
          .prepare("SELECT * FROM projects WHERE id = ?")
          .bind(id)
          .first<{
            id: string;
            title: string;
            status: string;
            category: string;
            location: string;
            current_phase: string | null;
            description: string | null;
            created_at: string;
          }>();

        if (!existing) {
          return Response.json(
            {
              success: false,
              error: "Project not found",
            },
            { status: 404 }
          );
        }

        const title = body.title ?? existing.title;
        const status = body.status ?? existing.status;
        const category = body.category ?? existing.category;
        const location = body.location ?? existing.location;

        const currentPhase =
          status === "in_progress"
            ? (body.current_phase ?? existing.current_phase)
            : null;

        const description =
          body.description !== undefined
            ? body.description
            : existing.description;

        await env.DB.prepare(`
          UPDATE projects
          SET
            title = ?,
            status = ?,
            category = ?,
            location = ?,
            current_phase = ?,
            description = ?
          WHERE id = ?
        `)
          .bind(
            title,
            status,
            category,
            location,
            currentPhase,
            description,
            id
          )
          .run();

        const project = await env.DB
          .prepare("SELECT * FROM projects WHERE id = ?")
          .bind(id)
          .first();

        return Response.json({
          success: true,
          project,
        });
      }

      // ============================================================
      // DELETE /projects/:id
      // Delete project + all associated R2 images
      // ============================================================
      if (
        request.method === "DELETE" &&
        url.pathname.startsWith("/projects/") &&
        !url.pathname.includes("/images")
      ) {
        const id = url.pathname.split("/")[2];

        if (!id) {
          return Response.json(
            {
              success: false,
              error: "Project ID is required",
            },
            { status: 400 }
          );
        }

        const existing = await env.DB
          .prepare("SELECT id FROM projects WHERE id = ?")
          .bind(id)
          .first();

        if (!existing) {
          return Response.json(
            {
              success: false,
              error: "Project not found",
            },
            { status: 404 }
          );
        }

        // Get all R2 objects belonging to this project
        const { results: images } = await env.DB
          .prepare(
            "SELECT object_key FROM project_images WHERE project_id = ?"
          )
          .bind(id)
          .all<{ object_key: string }>();

        // Delete all associated images from R2
        await Promise.all(
          images.map((image) => env.MEDIA.delete(image.object_key))
        );

        // Delete project from D1.
        // project_images are removed automatically because of ON DELETE CASCADE.
        await env.DB
          .prepare("DELETE FROM projects WHERE id = ?")
          .bind(id)
          .run();

        return Response.json({
          success: true,
          message: "Project and associated images deleted",
        });
      }

      // ============================================================
      // PUT /media/:key
      // Upload object to R2
      // ============================================================
      if (
        request.method === "PUT" &&
        url.pathname.startsWith("/media/")
      ) {
        const key = decodeURIComponent(
          url.pathname.slice("/media/".length)
        );

        if (!key) {
          return Response.json(
            {
              success: false,
              error: "Object key is required",
            },
            { status: 400 }
          );
        }

        await env.MEDIA.put(key, request.body, {
          httpMetadata: {
            contentType:
              request.headers.get("content-type") ||
              "application/octet-stream",
          },
        });

        return Response.json({
          success: true,
          object_key: key,
        });
      }

      // ============================================================
      // GET /projects/:id/images
      // Get all images belonging to a project
      // ============================================================
      if (
        request.method === "GET" &&
        url.pathname.startsWith("/projects/") &&
        url.pathname.endsWith("/images")
      ) {
        const parts = url.pathname.split("/");
        const projectId = parts[2];

        if (!projectId) {
          return Response.json(
            {
              success: false,
              error: "Project ID is required",
            },
            { status: 400 }
          );
        }

        const { results } = await env.DB.prepare(`
          SELECT
            id,
            project_id,
            object_key,
            image_type,
            sort_order,
            created_at
          FROM project_images
          WHERE project_id = ?
          ORDER BY sort_order ASC, created_at ASC
        `)
          .bind(projectId)
          .all();

        return Response.json({
          success: true,
          images: results,
        });
      }

      // ============================================================
      // POST /projects/:id/images
      // Register an uploaded image in D1
      // ============================================================
      if (
        request.method === "POST" &&
        url.pathname.startsWith("/projects/") &&
        url.pathname.endsWith("/images")
      ) {
        const parts = url.pathname.split("/");
        const projectId = parts[2];

        if (!projectId) {
          return Response.json(
            {
              success: false,
              error: "Project ID is required",
            },
            { status: 400 }
          );
        }

        // Make sure the project exists.
        const project = await env.DB
          .prepare("SELECT id FROM projects WHERE id = ?")
          .bind(projectId)
          .first();

        if (!project) {
          return Response.json(
            {
              success: false,
              error: "Project not found",
            },
            { status: 404 }
          );
        }

        const body = await request.json<{
          id?: string;
          object_key: string;
          image_type: "cover" | "gallery";
          sort_order?: number;
        }>();

        if (!body.object_key) {
          return Response.json(
            {
              success: false,
              error: "object_key is required",
            },
            { status: 400 }
          );
        }

        // Guard: Reject if object_key is already bound to a DIFFERENT project_id
        const conflictingImage = await env.DB
          .prepare(
            "SELECT id, project_id FROM project_images WHERE object_key = ? AND project_id != ?"
          )
          .bind(body.object_key, projectId)
          .first<{ id: string; project_id: string }>();

        if (conflictingImage) {
          return Response.json(
            {
              success: false,
              error: `object_key '${body.object_key}' is already associated with project '${conflictingImage.project_id}'`,
            },
            { status: 400 }
          );
        }

        if (
          body.image_type !== "cover" &&
          body.image_type !== "gallery"
        ) {
          return Response.json(
            {
              success: false,
              error: "image_type must be cover or gallery",
            },
            { status: 400 }
          );
        }

        const imageId = body.id ?? crypto.randomUUID();

        // Use UPSERT for project_images in case the same object_key or imageId exists
        const existingImage = await env.DB
          .prepare("SELECT id FROM project_images WHERE id = ?")
          .bind(imageId)
          .first();

        if (existingImage) {
          await env.DB.prepare(`
            UPDATE project_images
            SET
              object_key = ?,
              image_type = ?,
              sort_order = ?
            WHERE id = ?
          `)
            .bind(
              body.object_key,
              body.image_type,
              body.sort_order ?? 0,
              imageId
            )
            .run();
        } else {
          await env.DB.prepare(`
            INSERT INTO project_images (
              id,
              project_id,
              object_key,
              image_type,
              sort_order
            )
            VALUES (?, ?, ?, ?, ?)
          `)
            .bind(
              imageId,
              projectId,
              body.object_key,
              body.image_type,
              body.sort_order ?? 0
            )
            .run();
        }

        const image = await env.DB
          .prepare(`
            SELECT
              id,
              project_id,
              object_key,
              image_type,
              sort_order,
              created_at
            FROM project_images
            WHERE id = ?
          `)
          .bind(imageId)
          .first();

        return Response.json(
          {
            success: true,
            image,
          },
          { status: 201 }
        );
      }

      // ============================================================
      // DELETE /media/:key
      // Delete object from R2
      // ============================================================
      if (
        request.method === "DELETE" &&
        url.pathname.startsWith("/media/")
      ) {
        const key = decodeURIComponent(
          url.pathname.slice("/media/".length)
        );

        if (!key) {
          return Response.json(
            {
              success: false,
              error: "Object key is required",
            },
            { status: 400 }
          );
        }

        await env.MEDIA.delete(key);

        return Response.json({
          success: true,
          object_key: key,
        });
      }

      // ============================================================
      // GET /media/:key
      // Read object from R2
      // ============================================================
      if (
        request.method === "GET" &&
        url.pathname.startsWith("/media/")
      ) {
        const key = decodeURIComponent(
          url.pathname.slice("/media/".length)
        );

        if (!key) {
          return Response.json(
            {
              success: false,
              error: "Object key is required",
            },
            { status: 400 }
          );
        }

        const object = await env.MEDIA.get(key);

        if (!object) {
          return Response.json(
            {
              success: false,
              error: "Media not found",
            },
            { status: 404 }
          );
        }

        const headers = new Headers();

        object.writeHttpMetadata(headers);

        headers.set("etag", object.httpEtag);

        headers.set(
          "cache-control",
          "public, max-age=31536000, immutable"
        );

        return new Response(object.body, {
          headers,
        });
      }

      // ============================================================
      // DELETE /projects/:projectId/images/:imageId
      // Delete image from R2 + D1
      // ============================================================
      if (
        request.method === "DELETE" &&
        url.pathname.startsWith("/projects/") &&
        url.pathname.includes("/images/")
      ) {
        const parts = url.pathname.split("/");

        const projectId = parts[2];
        const imageId = parts[4];

        if (!projectId || !imageId) {
          return Response.json(
            {
              success: false,
              error: "Project ID and image ID are required",
            },
            { status: 400 }
          );
        }

        const image = await env.DB
          .prepare(`
            SELECT
              id,
              project_id,
              object_key
            FROM project_images
            WHERE id = ?
              AND project_id = ?
          `)
          .bind(imageId, projectId)
          .first<{
            id: string;
            project_id: string;
            object_key: string;
          }>();

        if (!image) {
          return Response.json(
            {
              success: false,
              error: "Project image not found",
            },
            { status: 404 }
          );
        }

        // Delete the actual file from R2 first.
        await env.MEDIA.delete(image.object_key);

        // Then remove the database reference.
        await env.DB.prepare(`
          DELETE FROM project_images
          WHERE id = ?
            AND project_id = ?
        `)
          .bind(imageId, projectId)
          .run();

        return Response.json({
          success: true,
          image_id: imageId,
          object_key: image.object_key,
        });
      }

      // ============================================================
      // Not found
      // ============================================================
      return Response.json(
        {
          success: false,
          error: "Not found",
        },
        { status: 404 }
      );
    } catch (error) {
      console.error("[WORKER ERROR]", error);

      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "D1 query failed",
        },
        { status: 500 }
      );
    }
  },
};