import type { NextAuthConfig } from "next-auth";

// This configuration is shared between middleware and the full auth setup.
// It MUST NOT import any database-related modules or bcrypt to keep middleware lightweight.
export default {
  providers: [], // Providers are added in the full auth.ts
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
        token.id = user.id;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      if (token.department && session.user) {
        session.user.department = token.department as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublicRoute = ["/", "/login", "/signup"].includes(nextUrl.pathname);
      const isApiPublicRoute = 
        nextUrl.pathname.startsWith("/api/chat") || 
        nextUrl.pathname.startsWith("/api/ai") ||
        nextUrl.pathname.startsWith("/api/tickets") ||
        nextUrl.pathname.startsWith("/api/auth");
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      
      if (isPublicRoute || isApiPublicRoute) {
        return true;
      }
      
      if (isAdminRoute) {
        return isLoggedIn && auth?.user?.role === "admin";
      }
      
      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
