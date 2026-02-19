import NextAuth from "next-auth"

const handler = NextAuth({
  providers: [
    // Add your authentication providers here
  ],
})

export { handler as GET, handler as POST }
