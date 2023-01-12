import { USER } from "../helpers/constants";
import { prismaMock } from "../helpers/prismaMock";
import { authorize, ErrorCode } from "@/src/lib/auth";

jest.mock("bcryptjs", () => ({
  compare: jest
    .fn()
    .mockImplementation((plain, hashed) => Promise.resolve(plain == hashed)),
}));

test("should authorize with valid credentials", async () => {
  prismaMock.user.findUnique.mockResolvedValue(USER);

  await expect(
    authorize({ email: USER.email, password: USER.password })
  ).resolves.toEqual({ id: USER.id, name: USER.name, email: USER.email });
});

test("should fail if e-mail not found", async () => {
  prismaMock.user.findUnique.mockResolvedValue(null);

  await expect(
    authorize({ email: "fake@mail.com", password: USER.password })
  ).rejects.toEqual(new Error(ErrorCode.UserNotFound));
});
