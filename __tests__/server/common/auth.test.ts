import { ErrorCode } from "~/lib/errorCodes";

import { authorize } from "~/server/common/auth";

import { CompletetUser } from "../../factories/user";
import { prismaMock } from "../../helpers/prismaMock";

jest.mock("bcryptjs", () => ({
  compare: jest.fn().mockImplementation((plain, hashed) => Promise.resolve(plain == hashed)),
}));

test("should authorize with valid credentials", async () => {
  prismaMock.user.findUnique.mockResolvedValue(CompletetUser);

  await expect(
    authorize({ email: CompletetUser.email, password: CompletetUser.password })
  ).resolves.toEqual({
    id: CompletetUser.id,
    name: CompletetUser.name,
    email: CompletetUser.email,
  });
});

test("should fail if e-mail not found", async () => {
  prismaMock.user.findUnique.mockResolvedValue(null);

  await expect(
    authorize({ email: "fake@mail.com", password: CompletetUser.password })
  ).rejects.toEqual(new Error(ErrorCode.UserNotFound));
});
