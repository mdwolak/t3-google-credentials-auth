import { ErrorCode } from "~/lib/errorCodes";
import { authorize } from "~/server/auth";

import { CompleteUser } from "../../factories/user";
import { prismaMock } from "../../helpers/prismaMock";

jest.mock("bcryptjs", () => ({
  compare: jest.fn().mockImplementation((plain, hashed) => Promise.resolve(plain == hashed)),
}));

test("should authorize with valid credentials", async () => {
  prismaMock.user.findUnique.mockResolvedValue(CompleteUser);

  await expect(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    authorize({ email: CompleteUser.email, password: CompleteUser.password! }),
  ).resolves.toEqual({
    id: CompleteUser.id,
    name: CompleteUser.name,
    email: CompleteUser.email,
    emailVerified: expect.any(Date), // Ignore emailVerified field in the comparison
    role: CompleteUser.role,
    orgId: undefined,
    signupProvider: null,
  });
});

test("should fail if e-mail not found", async () => {
  prismaMock.user.findUnique.mockResolvedValue(null);

  await expect(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    authorize({ email: "fake@mail.com", password: CompleteUser.password! }),
  ).rejects.toEqual(new Error(ErrorCode.InvalidEmailOrPassword));
});
