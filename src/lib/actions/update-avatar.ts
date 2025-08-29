"use server";

import { auth } from "@/auth";
import { deleteAvatar } from "./delete-avatar";
import { handleApiError } from "@/lib/normalizers/handle-api-error";

export interface ProfilePictureApiResponse {
  id: string;
  url: string;
}
export interface AvatarUpdateResponse {
  error: boolean;
  message: string;
  data?: ProfilePictureApiResponse;
}

/**
 * @action
 * @param {FormData} formData - The form data containing the avatar file.
 * @returns {Promise<AvatarUpdateResponse>} - A promise that resolves to an object containing the result of the operation.
 *
 * @example
 * await updateAvatar(formData);
 */
export const updateAvatar = async (
  formData: FormData
): Promise<AvatarUpdateResponse> => {
  const session = await auth();

  formData.append("ref", "plugin::users-permissions.user");
  formData.append("field", "avatar");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.user.jwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    return await handleApiError(response, "Failed to update avatar");
  }

  const avatarDeleteResponse = await deleteAvatar(
    session?.user.avatar?.id as string
  );

  if (avatarDeleteResponse?.error) {
    console.error("Error trying to delete old avatar");
  }

  const data: ProfilePictureApiResponse[] = await response.json();

  if ("url" in data[0]) {
    return {
      error: false,
      message: "Avatar updated successfully!",
      data: data[0],
    };
  }

  return {
    error: true,
    message: "Failed to update avatar",
  };
};
