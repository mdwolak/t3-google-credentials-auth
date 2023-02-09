import type { User } from "@prisma/client";

export const CompletetUser = {
  id: "1",
  name: "Joe Bloggs",
  email: "joe@bloggs.com",
  password: "youwouldnotguess!",
  emailVerified: null,
  image: "",
  createdDate: new Date(),
};

const UserFactory = {
  create: (args: Partial<User> = {}): User => {
    return {
      ...CompletetUser,
      ...args,
    };
  },
};

export default UserFactory;