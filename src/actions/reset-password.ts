"use server";

import { ResetPasswordFormData } from "@/app/auth/reset-password/types";

interface ResetPasswordPayload {
  password: string;
  passwordConfirmation: string;
  code: string;
}

export async function transformResetPasswordData(
  formData: ResetPasswordFormData
): Promise<ResetPasswordPayload> {
  return {
    password: formData.password,
    passwordConfirmation: formData.confirmPassword,
    code: formData.code,
  };
}

interface ResetPasswordSuccessResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface ResetPasswordErrorResponse {
  data: Record<string, unknown>;
  error: {
    status: number;
    name: string;
    message: string;
    details: Record<string, unknown>;
  };
}

export default async function resetPassword(
  body: ResetPasswordPayload
): Promise<ResetPasswordSuccessResponse | false> {
  const response = await fetch(`${process.env.API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseBody:
    | ResetPasswordSuccessResponse
    | ResetPasswordErrorResponse = await response.json();

  if (!response.ok) {
    if ("error" in responseBody && responseBody.error?.message) {
      throw Error(responseBody.error.message);
    }
    throw Error("Error trying to reset password!");
  }

  if ("jwt" in responseBody && responseBody.user) {
    return responseBody;
  }

  return false;
}
