"use server";

import { auth } from "@/auth";
import { handleApiError } from "@/lib/normalizers/handle-api-error";

export interface DeleteAvatarResponse {
  error: boolean;
  message: string;
}

export const deleteAvatar = async (
  avatarId: string | null
): Promise<DeleteAvatarResponse | void> => {
  if (!avatarId) return;

  const session = await auth();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/upload/files/${avatarId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.user.jwt}`,
      },
    }
  );

  if (!response.ok) {
    return await handleApiError(response, "Failed to update avatar");
  }

  return {
    error: false,
    message: "Avatar deleted",
  };
};
