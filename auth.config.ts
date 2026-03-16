import type { NextAuthConfig } from "next-auth";

// This configuration is shared between middleware and the full auth setup.
// It MUST NOT import any database-related modules or bcrypt to keep middleware lightweight.
export default {
  providers: [], // Providers are added in the full auth.ts
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublicRoute = ["/", "/login", "/signup"].includes(nextUrl.pathname);
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      
      if (isPublicRoute) {
        return true;
      }
      
      if (isAdminRoute) {
        return isLoggedIn && auth?.user?.role === "admin";
      }
      
      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
