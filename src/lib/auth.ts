import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcrypt"
import { AuthOptions, Session, getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/",
    signOut: "/",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@aurorium.com",
        },
        password: { label: "Hasło", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null
        // Add logic here to look up the user from the credentials supplied
        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) return null

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        )

        if (!isPasswordValid) return null

        return user
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      const dbUser = await db.user.findUnique({
        where: { email: token.email! },
      })

      if (!dbUser) return token

      return {
        id: dbUser.id,
        name: dbUser.name,
        lastname: dbUser.lastname,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
    async session({ token, session }) {
      if (token) {
        return {
          ...session,
          user: {
            id: token.id,
            name: token.name,
            lastname: token.lastname,
            email: token.email,
            image: token.picture,
          },
        }
      }

      return session
    },
    // redirect: () => "/",
  },
}

interface AuthSession extends Session {
  user: {
    id: string
    name: string
    lastname: string
    email: string
  }
}

export const getAuthSession = () =>
  getServerSession(authOptions) as Promise<AuthSession>
