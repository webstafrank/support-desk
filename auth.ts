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
  ...authConfig,
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.department = token.department as string | null;
      }
      return session;
    },
  },
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

        // Verify password using bcrypt
        try {
          passwordsMatch = bcrypt.compareSync(
            inputPassword,
            user.hashedPassword
          );
        } catch (e) {
          console.error("Bcrypt comparison error:", e);
          return null;
        }

        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
});
