"use server";

import { signIn } from "@/auth";
import { SignInFormData } from "@/app/auth/sign-in/types";

type SignInPayload = SignInFormData;

export default async function signInAction(data: SignInPayload) {
  try {
    await signIn("credentials", {
      identifier: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
      redirect: false,
    });
  } catch (error) {
    throw error;
  }
}
