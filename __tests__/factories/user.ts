import { type User, UserRole } from "@prisma/client";

export const CompleteUser: User = {
  id: 1,
  name: "Joe Bloggs",
  email: "joe@bloggs.com",
  password: "you_would_not_guess!",
  emailVerified: null,
  image: "",
  createdDate: new Date(),
  updatedAt: new Date(),
  role: UserRole.USER,
  provider: null,
};

const UserFactory = {
  create: (args: Partial<User> = {}): User => {
    return {
      ...CompleteUser,
      ...args,
    };
  },
};

export default UserFactory;
