import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;
  const role = user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/login", "/signup"].includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  // 1. Allow API Auth routes always
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // 2. Redirect logged-in users away from public auth pages
  if (isPublicRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL(role === "admin" ? "/admin" : "/", nextUrl)
      );
    }
    return NextResponse.next();
  }

  // 3. Ensure user is logged in for all other routes
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // 4. Role-based access control
  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // 5. Admin-specific restrictions for user-facing routes
  // Redirect admins away from user-only pages (including the home page) to the admin dashboard
  if (role === "admin") {
    const isUserOnlyRoute = nextUrl.pathname === "/" || nextUrl.pathname === "/tickets/create" || nextUrl.pathname === "/waitlist";
    if (isUserOnlyRoute) {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
