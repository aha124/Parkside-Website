import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Vanity URL mapping: /parksideharmony → sets chorus to "harmony" and redirects to /home
const VANITY_CHORUS_MAP: Record<string, string> = {
  "/parksideharmony": "harmony",
  "/parksidemelody": "melody",
  "/parksidevoices": "voices",
};

export default auth((req) => {
  const pathname = req.nextUrl.pathname;

  // Handle vanity chorus URLs (case-insensitive)
  const chorusValue = VANITY_CHORUS_MAP[pathname.toLowerCase()];
  if (chorusValue) {
    const response = NextResponse.redirect(new URL("/home", req.url), 302);
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    response.cookies.set("parkside_chorus", chorusValue, {
      expires,
      path: "/",
    });
    return response;
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/admin/login";
  const isApiAuthRoute = pathname.startsWith("/api/auth");

  // Allow auth API routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // For admin API routes, require authentication (defense-in-depth, routes also check auth)
  if (isAdminApiRoute) {
    if (!req.auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!req.auth.user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // For admin routes (except login), require authentication
  if (isAdminRoute && !isLoginPage) {
    if (!req.auth) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is admin
    if (!req.auth.user?.isAdmin) {
      return NextResponse.redirect(new URL("/admin/login?error=AccessDenied", req.url));
    }
  }

  // Redirect authenticated admins away from login page
  if (isLoginPage && req.auth?.user?.isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/auth/:path*",
    "/api/admin/:path*",
    // Vanity chorus URLs — listed in common case variants since
    // Next.js matchers don't support case-insensitive matching.
    // The middleware normalizes to lowercase, so any matched variant works.
    "/parksideharmony",
    "/parksidemelody",
    "/parksidevoices",
    "/ParksideHarmony",
    "/ParksideMelody",
    "/ParksideVoices",
    "/PARKSIDEHARMONY",
    "/PARKSIDEMELODY",
    "/PARKSIDEVOICES",
  ],
};
