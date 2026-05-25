import { prisma } from "@/lib/prisma"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Harap masukkan username dan password")
        }

        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username }
        })

        if (!admin) {
          throw new Error("Username tidak ditemukan")
        }

        const isValid = await bcrypt.compare(credentials.password, admin.password)

        if (!isValid) {
          throw new Error("Password salah")
        }

        return {
          id: admin.id.toString(),
          name: admin.name,
          email: admin.username
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
      }
      return session
    }
  }
}
