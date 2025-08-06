"use server";

import { signIn } from "@/auth";

interface SignInPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

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
