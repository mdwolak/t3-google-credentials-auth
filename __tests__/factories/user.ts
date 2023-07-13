import { type User, UserRole } from "@prisma/client";

type NonNullableProps<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

export const CompleteUser: NonNullableProps<User> = {
  id: 1,
  name: "Joe Bloggs",
  email: "joe@bloggs.com",
  password: "you_would_not_guess!",
  emailVerified: new Date(),
  image: "",
  createdDate: new Date(),
  updatedAt: new Date(),
  role: UserRole.USER,
  provider: "default",
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
