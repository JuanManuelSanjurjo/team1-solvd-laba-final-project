import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(5, "Username must be at least 5 characters")
      .regex(/^\S*$/, "Username cannot contain spaces"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;