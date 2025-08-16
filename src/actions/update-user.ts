"use server";

import { auth } from "@/auth";
import { UpdateProfileFormData } from "@/app/(side-bar)/update-profile/types";

type UpdateUserPayload = UpdateProfileFormData;

export const updateUser = async (data: UpdateUserPayload, userId: string) => {
  const session = await auth();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.jwt}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return await response.json();
};
