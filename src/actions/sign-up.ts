"use server";

interface SignUpPayload {
  username: string;
  email: string;
  password: string;
}

type SignUpResponse = Omit<{ id: number } & SignUpPayload, "password">;

interface SignUpErrorResponse {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
    details: Record<string, unknown>;
  };
}

interface SignUpSuccessResponse {
  user: {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    phoneNumber: string | null;
    firstName: string | null;
    lastName: string | null;
    customerId: string | null;
  };
}

export default async function SignUp(
  body: SignUpPayload,
): Promise<SignUpResponse | false> {
  const response = await fetch(`${process.env.API_URL}/auth/local/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseBody: SignUpSuccessResponse | SignUpErrorResponse =
    await response.json();

  if (!response.ok) {
    if ("error" in responseBody && responseBody.error?.message) {
      throw Error(responseBody.error.message);
    }
    throw Error("Error trying to sign up!");
  }

  if ("user" in responseBody && responseBody.user) {
    const user = responseBody.user;
    const data: SignUpResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    return data;
  }

  return false;
}
