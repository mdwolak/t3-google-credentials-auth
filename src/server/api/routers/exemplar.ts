import { filterQuery, numericId } from "~/lib/schemas/common";
import { createExemplarSchema, updateExemplarSchema } from "~/lib/schemas/exemplar";
import { publicProcedure, router } from "~/server/api/trpc";
import {
  getPrismaUserFromContext,
  throwConflictWithZodError,
  throwNotFound,
} from "~/server/api/trpcHelper";
import { IsNotFoundError, IsUniqueConstraintViolation } from "~/server/db";
import * as exemplarService from "~/server/services/exemplar";

const entityName = "Exemplar";

const errorHandler = (error: unknown) => {
  if (IsNotFoundError(error)) {
    throwNotFound(entityName);
  }

  if (IsUniqueConstraintViolation(error, ["title"])) {
    throwConflictWithZodError(entityName, ["title"]);
  }
};

const handleRequest = async <T>(handler: () => Promise<T>) => {
  try {
    return await handler();
  } catch (error) {
    errorHandler(error);

    throw error;
  }
};

export const exemplarRouter = router({
  createExemplar: publicProcedure.input(createExemplarSchema).mutation(({ input, ctx }) =>
    handleRequest(async () => {
      const exemplar = await exemplarService.create({
        ...input,
        user: getPrismaUserFromContext(ctx),
      });

      return { exemplar };
    })
  ),
  updateExemplar: publicProcedure.input(updateExemplarSchema).mutation(({ input }) =>
    handleRequest(async () => {
      const exemplar = await exemplarService.update({ id: input.id }, input.data);
      return { exemplar };
    })
  ),
  deleteExemplar: publicProcedure.input(numericId).mutation(({ input }) =>
    handleRequest(async () => {
      await exemplarService.remove({ id: input });
    })
  ),
  getExemplar: publicProcedure.input(numericId).query(({ input }) =>
    handleRequest(async () => {
      const exemplar = await exemplarService.findUniqueOrThrow({ id: input });
      return { exemplar };
    })
  ),
  getExemplars: publicProcedure.input(filterQuery).query(({ input }) =>
    handleRequest(async () => {
      const exemplars = await exemplarService.findAll(input.page, input.limit);
      return { results: exemplars.length, exemplars };
    })
  ),
});
