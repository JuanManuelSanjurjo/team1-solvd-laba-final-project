"use server";

import { handleApiError } from "@/lib/normalizers/handle-api-error";

export interface ResetPasswordPayload {
  password: string;
  passwordConfirmation: string;
  code: string;
}

export interface ResetPasswordResponse {
  error: boolean;
  message: string;
}

/**
 * @action
 * @param {ResetPasswordPayload} body - The payload for resetting the password.
 * @returns {Promise<ResetPasswordResponse>} - A promise that resolves to an object containing the result of the operation.
 *
 * @example
 * await resetPassword({
 *   password: "newPassword123",
 *   passwordConfirmation: "newPassword123",
 *   code: "resetCode123",
 * });
 */
export default async function resetPassword(
  body: ResetPasswordPayload
): Promise<ResetPasswordResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    return await handleApiError(response, "Failed to reset password");
  }

  return {
    error: false,
    message:
      "Password reset successful! You can now log in with your new password.",
  };
}
