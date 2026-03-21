import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import authConfig from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
  providers: [
    ...authConfig.providers,
    Credentials({
      async authorize(credentials) {
        if (!credentials?.name || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { name: credentials.name as string },
        });

        if (!user || !user.hashedPassword) return null;

        const inputPassword = credentials.password as string;
        let passwordsMatch = false;

        // Verify password using bcrypt
        try {
          passwordsMatch = bcrypt.compareSync(inputPassword, user.hashedPassword);
        } catch (e) {
          console.error("Bcrypt comparison error:", e);
          return null;
        }

        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
  },
  pages: authConfig.pages,
});
