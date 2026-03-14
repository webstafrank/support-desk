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
      
      if (isPublicRoute) {
        return true;
      }
      
      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
