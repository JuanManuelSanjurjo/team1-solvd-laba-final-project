"use server";

import {
  SignUpPayload,
  SignUpResponse,
  SignUpSuccessResponse,
} from "@/app/auth/sign-up/types";
import { handleApiError } from "@/lib/normalizers/handle-api-error";

/**
 * @action
 * @param {SignUpPayload} body - The payload for sign-up.
 * @returns {Promise<SignUpResponse>} - A promise that resolves to an object containing the result of the operation.
 *
 * @example
 * await signUp({
 *   username: "user123",
 *   email: "user@example.com",
 *   password: "password123",
 *   passwordConfirmation: "password123",
 * });
 */
export default async function signUp(
  body: SignUpPayload
): Promise<SignUpResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/local/register`,
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

  const responseBody: SignUpSuccessResponse = await response.json();

  if ("user" in responseBody && responseBody.user) {
    return {
      error: false,
      message: "Success! Please confirm your account in your e-mail",
    };
  }

  return { error: true, message: "Error trying to sign up!" };
}
