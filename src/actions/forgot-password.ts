"use server";

import { ForgotPasswordFormData } from "@/app/auth/forgot-password/types";
import { handleApiError } from "@/lib/normalizers/handle-api-error";

export interface ForgotPasswordResponse {
  error: boolean;
  message: string;
}

export default async function forgotPassword(
  body: ForgotPasswordFormData
): Promise<ForgotPasswordResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    return await handleApiError(response, "Failed to update avatar");
  }

  return {
    error: false,
    message: "Success! Please check your email for password reset instructions",
  };
}
