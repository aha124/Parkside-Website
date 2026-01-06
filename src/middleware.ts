import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

  // Allow auth API routes
  if (isApiAuthRoute) {
    return NextResponse.next();
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
  matcher: ["/admin/:path*", "/api/auth/:path*"],
};
