import { filterQuery, numericId } from "~/lib/schemas/common";
import { createExemplarSchema, updateExemplarSchema } from "~/lib/schemas/exemplar";
import { publicProcedure, router } from "~/server/api/trpc";
import {
  type ErrorHandlerOptions,
  getErrorFromUnknown,
  getPrismaUserFromContext,
  handleRequest,
} from "~/server/api/trpcHelper";
import * as exemplarService from "~/server/services/exemplar";

const errorHandler = (error: unknown) => {
  const errorHandlerOptions: ErrorHandlerOptions = {
    entityName: "Exemplar",
    dbFieldMappings: {
      content: "Content Label",
      category: "Category Label",
    },
  };

  throw getErrorFromUnknown(error, errorHandlerOptions);
};

export const exemplarRouter = router({
  createExemplar: publicProcedure.input(createExemplarSchema).mutation(({ input, ctx }) =>
    handleRequest(async () => {
      const exemplar = await exemplarService.create({
        ...input,
        user: getPrismaUserFromContext(ctx),
      });

      return { exemplar };
    }, errorHandler)
  ),
  updateExemplar: publicProcedure.input(updateExemplarSchema).mutation(({ input }) =>
    handleRequest(async () => {
      const exemplar = await exemplarService.update({ id: input.id }, input.data);
      return { exemplar };
    }, errorHandler)
  ),
  deleteExemplar: publicProcedure.input(numericId).mutation(({ input }) =>
    handleRequest(async () => {
      await exemplarService.remove({ id: input });
    }, errorHandler)
  ),
  getExemplar: publicProcedure.input(numericId).query(({ input }) =>
    handleRequest(async () => {
      const exemplar = await exemplarService.findUniqueOrThrow({ id: input });
      return { exemplar };
    }, errorHandler)
  ),
  getExemplars: publicProcedure.input(filterQuery).query(({ input }) =>
    handleRequest(async () => {
      const exemplars = await exemplarService.findAll(input.page, input.limit);
      return { results: exemplars.length, exemplars };
    }, errorHandler)
  ),
});
