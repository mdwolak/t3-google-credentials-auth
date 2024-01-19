import { type $Enums } from "@prisma/client";
import z, { type TypeOf } from "zod";

import { requiredString } from "./common.schema";

type PrismaUserRole = $Enums.UserRole;

export const UserRole: { [key in PrismaUserRole]: PrismaUserRole } = {
  User: "User",
  Admin: "Admin",
} as const;

export const email = z
  .string()
  .trim()
  .min(1, "Email address is required")
  .email("Email address is invalid");

export const name = z.string().trim().min(2, "Name is required");

export const password = z
  .string()
  .trim()
  .min(1, "Password is required")
  .min(8, "Password must be more than 8 characters")
  .max(32, "Password must be less than 32 characters");

//
export const createUserSchema = z
  .object({
    name,
    email,
    password,
    passwordConfirm: z.string().trim().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  });

export type CreateUserInput = TypeOf<typeof createUserSchema>;

export const updateUserSchema = z.object({
  id: z.number(),
  data: z.object({
    name,
    email,
    role: z.nativeEnum(UserRole),
  }),
});

export type UpdateUserInput = TypeOf<typeof updateUserSchema>;

export const changePasswordSchema = z.object({
  id: z.number(),
  data: z
    .object({
      oldPassword: z.string().trim().min(1, "Please enter your old password"),
      password,
      passwordConfirm: z.string().trim().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      path: ["passwordConfirm"],
      message: "Passwords do not match",
    }),
});
export type ChangePasswordInput = TypeOf<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({
  email,
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

//
export const resetPasswordSchema = z.object({
  token: requiredString,
  password,
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
