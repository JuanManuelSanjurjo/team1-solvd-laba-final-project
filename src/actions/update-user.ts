"use server";

import { auth } from "@/auth";

interface UpdateUserPayload {
  username?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
  phoneNumber?: string | undefined;
}

export const updateUser = async (data: UpdateUserPayload, userId: string) => {
  const session = await auth();

  const response = await fetch(`${process.env.API_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user.jwt}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return await response.json();
};
