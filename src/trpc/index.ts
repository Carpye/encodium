import { db } from "@/lib/db"
import { SignUpValidator } from "@/lib/validators/signup"
import { TRPCError } from "@trpc/server"
import bcrypt from "bcrypt"
import crypto from "crypto"
import {
  authorizedProcedure,
  createCallerFactory,
  publicProcedure,
  router,
} from "./trpc"
import { z } from "zod"
import { ProfileValidator } from "@/lib/validators/profile"
import { decrypt, encrypt } from "@/lib/utils"

export const appRouter = router({
  user: router({
    get: authorizedProcedure
      .input(
        z.object({
          name: z.string().nullish(),
          email: z.string().nullish(),
        }),
      )
      .query(async (options) => {
        const { user } = options.ctx

        const dbUser = await db.user.findUnique({
          where: {
            id: user.id,
          },
        })

        if (!dbUser) throw new TRPCError({ code: "NOT_FOUND" })

        return dbUser
      }),
    create: publicProcedure.input(SignUpValidator).mutation(async (options) => {
      const { email, password: nakedPassword, name, lastname } = options.input

      const user = await db.user.findUnique({
        where: {
          email,
        },
      })

      if (user) throw new TRPCError({ code: "FORBIDDEN" })

      const password = await bcrypt.hash(nakedPassword, 10)

      const createdUser = await db.user.create({
        data: {
          name,
          lastname,
          email,
          password,
        },
      })

      return {
        user: createdUser,
        credentials: {
          email,
          password: nakedPassword,
        },
      }
    }),
    update: authorizedProcedure
      .input(ProfileValidator)
      .mutation(async ({ input, ctx }) => {
        const { email, name, lastname, image } = input

        console.log(ctx)

        const user = await db.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        })

        if (!user) throw new TRPCError({ code: "NOT_FOUND" })

        const updatedUser = await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            name,
            lastname,
            email,
            image,
          },
        })

        return updatedUser
      }),
  }),
  message: router({
    get: authorizedProcedure.query(async ({ ctx }) => {
      const message = await db.message.findMany({
        where: {
          userId: ctx.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return message
    }),
    encrypt: authorizedProcedure
      .input(z.string())
      .mutation(async ({ ctx, input }) => {
        console.log("start encyrpting")

        const encrypted = encrypt(input)

        console.log(encrypted)

        const createdMessage = await db.message.create({
          data: {
            isEncrypted: true,
            content: encrypted,
            userId: ctx.user.id,
          },
        })

        return createdMessage
      }),
    decrypt: authorizedProcedure
      .input(z.string())
      .mutation(async ({ ctx, input: message }) => {
        console.log("start decrypting")

        const decrypted = decrypt(message)

        if (!decrypted) throw new TRPCError({ code: "BAD_REQUEST" })

        const createdMessage = await db.message.create({
          data: {
            isEncrypted: false,
            content: decrypted,
            userId: ctx.user.id,
          },
        })

        return decrypted
      }),
  }),
})

// 1. create a caller-function for your router
const createCaller = createCallerFactory(appRouter)

// 2. create a caller using your `Context`
export const caller = createCaller({})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
