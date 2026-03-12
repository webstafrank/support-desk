import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.name || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { name: credentials.name as string },
        });

        if (!user || !user.hashedPassword) return null;

        const inputPassword = credentials.password as string;
        let passwordsMatch = false;

        // Try bcrypt first
        try {
          passwordsMatch = await bcrypt.compare(inputPassword, user.hashedPassword);
        } catch (e) {
          // If it fails (e.g., not a hash), it might be plain text
          passwordsMatch = false;
        }

        // Fallback to plain text comparison for legacy users
        if (!passwordsMatch) {
          passwordsMatch = inputPassword === user.hashedPassword;
        }

        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublicRoute = ["/login", "/signup"].includes(nextUrl.pathname);
      
      if (isPublicRoute) {
        return true;
      }
      
      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
