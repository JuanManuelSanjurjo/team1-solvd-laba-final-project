"use server";

import { auth } from "@/auth";
import { deleteAvatar } from "./delete-avatar";

export interface UpdateAvatarResponse {
  id: string;
  url: string;
}

export const updateAvatar = async (
  formData: FormData
): Promise<UpdateAvatarResponse[]> => {
  const session = await auth();

  formData.append("ref", "plugin::users-permissions.user");
  formData.append("field", "avatar");

  const response = await fetch(`${process.env.API_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.user.jwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update avatar");
  }

  try {
    await deleteAvatar(session?.user.avatar?.id as string);
  } catch {
    console.error("Error trying to delete old avatar");
  }

  return await response.json();
};
