import { getAuthSession } from "@/lib/auth"
import { TRPCError, initTRPC } from "@trpc/server"
import { Session, getServerSession } from "next-auth"
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */

const t = initTRPC.context().create()
const middleware = t.middleware
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */

const isAuth = middleware(async (opts) => {
  const session = await getAuthSession()

  if (!session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return opts.next({
    ctx: {
      user: session.user,
    },
  })
})

export const router = t.router

export const createCallerFactory = t.createCallerFactory

export const publicProcedure = t.procedure
export const authorizedProcedure = t.procedure.use(isAuth)
