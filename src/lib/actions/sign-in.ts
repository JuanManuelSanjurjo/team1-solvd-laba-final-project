"use server";

import { signIn } from "@/auth";
import { SignInFormData, SignInResponse } from "@/app/auth/sign-in/types";

function cleanUpError(error: string) {
  return error.replace(/Read more at.*/, "").trim();
}

/**
 * @action
 * @param {SignInFormData} data - The form data for sign-in.
 * @returns {Promise<SignInResponse>} - A promise that resolves to an object containing the result of the operation.
 *
 * @example
 * await signInAction({
 *   email: "user@example.com",
 *   password: "password123",
 *   rememberMe: true,
 * });
 */
export default async function signInAction(
  data: SignInFormData
): Promise<SignInResponse> {
  try {
    await signIn("credentials", {
      identifier: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
      redirect: false,
    });

    return { error: false, message: "Login successful! Redirecting..." };
  } catch (error) {
    if (error instanceof Error) {
      return { error: true, message: cleanUpError(error.message) };
    }
    return { error: true, message: "An unknown error occurred" };
  }
}
