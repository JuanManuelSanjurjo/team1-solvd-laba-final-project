"use server";

import { ForgotPasswordFormData } from "@/app/auth/forgot-password/types";

type ForgotPasswordPayload = ForgotPasswordFormData;

interface ForgotPasswordSuccessResponse {
  ok: boolean;
}

interface ForgotPasswordErrorResponse {
  data: Record<string, unknown>;
  error: {
    status: number;
    name: string;
    message: string;
    details: Record<string, unknown>;
  };
}

export default async function forgotPassword(
  body: ForgotPasswordPayload
): Promise<boolean> {
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

  const responseBody:
    | ForgotPasswordSuccessResponse
    | ForgotPasswordErrorResponse = await response.json();

  if (!response.ok) {
    if ("error" in responseBody && responseBody.error?.message) {
      throw Error(responseBody.error.message);
    }
    throw Error("Error trying to reset password!");
  }

  if ("ok" in responseBody && responseBody.ok) {
    return true;
  }

  return false;
}
