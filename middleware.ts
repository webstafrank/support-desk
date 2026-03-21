import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

// Using the config-only initialization for middleware to keep it fast
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const role = req.auth?.user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/", "/login", "/signup"].includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  // 1. Allow API Auth routes always
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // 2. Redirect logged-in users away from auth pages (home, login, signup)
  const isAuthPage = ["/", "/login", "/signup"].includes(nextUrl.pathname);
  if (isLoggedIn) {
    if (isAuthPage) {
       return NextResponse.redirect(
        new URL(role === "admin" ? "/admin" : "/dashboard", nextUrl)
      );
    }
    return NextResponse.next();
  }

  // 3. Ensure user is logged in for all other routes
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // 4. Role-based access control
  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
