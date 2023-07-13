import type { User } from "@prisma/client";

import { CompleteUser } from "../../../factories/user";
import { type RouterInputs, RouterOutputs, prismaMock, trpcRequest } from "../../../helpers";

//trpcRequest(UserFactory.create());
describe("User signs up", () => {
  it("Using existing e-mail", async () => {
    const { name, email, password } = CompleteUser;

    type Input = RouterInputs["user"]["create"];
    const input: Input = { name, email, password, passwordConfirm: password };

    prismaMock.user.findUnique.mockResolvedValue({ name, email, password } as User);

    const caller = await trpcRequest();
    await expect(caller.user.create(input)).rejects.toThrowError(/Email already taken/);

    //await expect(caller.user.create(input)).rejects.toThrowError(/Email/);
    //).rejects.toEqual(new Error(ErrorCode.UserNotFound));
  });
  //  describe("trying to pass role", () => {
  //     it("throws an error", async () => {
  //       const query = `
  //           mutation SIGNUP($data: SignupInput!) {
  //             signup(data: $data) {
  //               token
  //               user {
  //                 id
  //               }
  //             }
  //           }
  //         `;
  //       const variables = {
  //         data: {
  //           email: "hello@wee.net",
  //           password: "fake",
  //           profile: { create: { firstName: chance.first(), lastName: chance.last() } },
  //           roles: { set: [Role.ADMIN] },
  //         },
  //       };
  //       const response = await graphQLRequest({ query, variables });
  //       const errors = response.body.errors.map((e: GraphQLError) => e.message);
  //       expect(errors).toMatchInlineSnapshot(`
  //           Array [
  //             "Variable \\"$data\\" got invalid value { email: \\"hello@wee.net\\", password: \\"fake\\", profile: { create: [Object] }, roles: { set: [Array] } }; Field \\"roles\\" is not defined by type \\"SignupInput\\".",
  //           ]
  //         `);
  //     });
  //   });
  test("Sending valid credentials creates the user", async () => {
    const { name, email, password } = CompleteUser;

    type Input = RouterInputs["user"]["create"];
    const input: Input = { name, email, password, passwordConfirm: password };

    prismaMock.user.create.mockResolvedValue({ name, email } as User);

    const caller = await trpcRequest();
    const response = await caller.user.create(input);

    expect(response.user).toMatchObject({ name, email });
    //IMPROVE: should not contain excluded sensitive fields
  });
});
