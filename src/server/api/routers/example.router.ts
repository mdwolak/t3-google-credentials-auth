import { z } from "zod";

import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  helloAdmin: adminProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input}"}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.exemplar.findMany();
  }),
});
