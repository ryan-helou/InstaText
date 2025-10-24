import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if password protection is enabled
  const sitePassword = process.env.SITE_PASSWORD;

  // Skip password check if not configured
  if (!sitePassword) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const authCookie = request.cookies.get("auth");

  if (authCookie?.value === sitePassword) {
    return NextResponse.next();
  }

  // Check for password in header (for initial login)
  const providedPassword = request.headers.get("x-site-password");

  if (providedPassword === sitePassword) {
    const response = NextResponse.next();
    response.cookies.set("auth", sitePassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  }

  // Return 401 for API routes, redirect to login for pages
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // For now, allow access (you can add a login page later)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
