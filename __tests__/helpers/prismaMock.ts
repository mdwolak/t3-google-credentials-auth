import { type PrismaClient } from "@prisma/client";
import { type DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";

import { db } from "~/server/db";

jest.mock("~/server/db", () => ({
  __esModule: true,
  db: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>;
