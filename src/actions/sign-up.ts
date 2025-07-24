"use server";

interface SignUpPayload {
  username: string;
  email: string;
  password: string;
}

type SignUpResponse = { id: number } & SignUpPayload;

export default async function SignUp(
  body: SignUpPayload
): Promise<SignUpResponse | false> {
  const response = await fetch(`${process.env.API_URL}/auth/local/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw Error("Error trying to sign up!");
  }

  const data: SignUpResponse = await response.json();

  return data;
}
