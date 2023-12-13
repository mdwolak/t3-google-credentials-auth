import { type NextApiRequest } from "next";
import { type Session } from "next-auth";

import { UserRole } from "@prisma/client";
import { type inferAsyncReturnType, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";

import { httpForbidden, httpUnauthorized } from "~/server/api/trpcHelper";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

type CreateContextOptions = {
  session: Session | null;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    ...opts,
    db,
  };
};

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();

  return await createContextInner({
    session,
    ...opts,
  });
};

export type Context = inferAsyncReturnType<typeof createTRPCContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

/**
 * Reusable middlewares
 * @see https://trpc.io/docs/server/middlewares
 */
const loggerMiddleware = t.middleware(async (opts) => {
  const start = Date.now();

  const result = await opts.next();

  const durationMs = Date.now() - start;
  const meta = { path: opts.path, type: opts.type, durationMs };

  result.ok
    ? console.log("OK request timing:", meta)
    : console.error("Non-OK request timing", meta);

  return result;
});

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw httpUnauthorized();
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const isAdmin = isAuthed.unstable_pipe(async ({ ctx, next }) => {
  if (ctx.session.user.role !== UserRole.Admin) {
    throw httpForbidden();
  }
  return next({ ctx });
});

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure.use(loggerMiddleware);

/**
 * Protected procedures
 **/
export const protectedProcedure = publicProcedure.use(isAuthed);

export const adminProcedure = publicProcedure.use(isAdmin);
