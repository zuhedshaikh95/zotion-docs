import * as z from "zod";

export const loginFormSchema = z.object({
  email: z.string().describe("Email").email({ message: "Invalid email!" }),
  password: z.string().describe("Password").min(1, "Password is required"),
});
