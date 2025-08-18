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

export type SignUpResponse = {
  error: boolean;
  message: string;
};

export type SignUpPayload = Omit<SignUpFormData, "confirmPassword">;

export interface SignUpErrorResponse {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
    details: Record<string, unknown>;
  };
}

export interface SignUpSuccessResponse {
  user: {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    phoneNumber: string | null;
    firstName: string | null;
    lastName: string | null;
    customerId: string | null;
  };
}
