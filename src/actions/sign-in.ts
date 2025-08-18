"use server";

import { signIn } from "@/auth";
import { SignInFormData, SignInResponse } from "@/app/auth/sign-in/types";

function cleanUpError(error: string) {
  return error.replace(/Read more at.*/, "").trim();
}

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
