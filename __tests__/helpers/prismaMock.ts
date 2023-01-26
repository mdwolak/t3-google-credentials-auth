import { type PrismaClient } from "@prisma/client";
import { type DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";

import { prisma } from "~/server/db/client";

jest.mock("~/server/db/client", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
