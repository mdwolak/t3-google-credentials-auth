import { type TypeOf, object, string } from "zod";

export const createUserSchema = object({
  name: string().trim().min(1, "Name is required"),
  email: string().min(1, "Email address is required").email("Email Address is invalid"),
  password: string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  passwordConfirm: string().trim().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;
