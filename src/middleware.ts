import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;
  const pathname = request.nextUrl.pathname;

  // Protect /api/admin write operations (POST, PATCH, PUT, DELETE)
  if (pathname.startsWith("/api/admin")) {
    const isWriteRequest = request.method !== "GET";
    if (isWriteRequest && !isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }
  }

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (isAuthenticated) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/projects";
        return NextResponse.redirect(url);
      }
    } else {
      if (!isAuthenticated) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }

      // If user accesses /admin or /admin/ directly, redirect to /admin/projects
      if (pathname === "/admin" || pathname === "/admin/") {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/projects";
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
