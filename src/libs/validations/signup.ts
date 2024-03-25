import * as z from "zod";

export const SignupFormSchema = z
  .object({
    email: z.string().describe("Email").email({ message: "Invalid Email" }),
    password: z.string().describe("Password").min(6, "Password must be of minimum 6 characters"),
    confirmPassword: z.string().describe("Confirm Password").min(6, "Password must be of minimum 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords did not match! Try again",
    path: ["confirmPassword"],
  });
