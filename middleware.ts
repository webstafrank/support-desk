import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("it_support_key")?.value;
  const role = request.cookies.get("it_support_role")?.value;
  const pathname = request.nextUrl.pathname;

  // Basic authentication check
  if (cookie !== "secret1234" && !pathname.startsWith("/login") && !pathname.startsWith("/signup")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users from login or signup to home/admin
  if ((pathname.startsWith("/login") || pathname.startsWith("/signup")) && cookie === "secret1234") {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Admin access control: Admins ONLY see /admin and home
  if (role === "admin") {
    if (pathname !== "/admin" && pathname !== "/" && pathname !== "/login") {
       // Optional: Redirect admins back to dashboard if they try to access user-only pages
       if (pathname.startsWith("/tickets/create") || pathname.startsWith("/waitlist")) {
          return NextResponse.redirect(new URL("/admin", request.url));
       }
    }
  }

  // User access control: Users ONLY see home, tickets/create, and waitlist
  if (role === "user") {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
