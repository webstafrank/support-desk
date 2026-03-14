import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
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
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
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

        // Try bcrypt first
        try {
          passwordsMatch = await bcrypt.compare(inputPassword, user.hashedPassword);
        } catch (e) {
          // Fallback to plain text comparison for legacy users
          passwordsMatch = inputPassword === user.hashedPassword;
        }

        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.name = user.name;
        token.id = user.id;
        token.department = (user as any).department;
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
        (session.user as any).department = token.department as string;
      }
      return session;
    },
    ...authConfig.callbacks,
  },
  ...authConfig,
});
