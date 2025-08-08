"use server";

import { auth } from "@/auth";

interface DeleteAvatarResponse {
  id: number;
  url: string;
}

export const deleteAvatar = async (
  avatarId: string | null
): Promise<DeleteAvatarResponse | void> => {
  if (!avatarId) return;

  const session = await auth();

  const response = await fetch(
    `${process.env.API_URL}/upload/files/${avatarId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.user.jwt}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete avatar");
  }

  return await response.json();
};
