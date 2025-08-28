"use server";

import { auth } from "@/auth";
import {
  UpdateProfileFormData,
  UpdateProfileResponse,
} from "@/app/(side-bar)/(profile)/update-profile/types";
import { handleApiError } from "@/lib/normalizers/handle-api-error";

/**
 * @action
 * @param {UpdateProfileFormData} data - The form data for updating the user profile.
 * @param {string} userId - The ID of the user to update.
 * @returns {Promise<UpdateProfileResponse>} - A promise that resolves to an object containing the result of the operation.
 *
 * @example
 * await updateUser({
 *   username: "newUsername",
 *   email: "newEmail@example.com",
 *   password: "newPassword123",
 *   passwordConfirmation: "newPassword123",
 * }, "123");
 */
export const updateUser = async (
  data: UpdateProfileFormData,
  userId: string
): Promise<UpdateProfileResponse> => {
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
    return await handleApiError(response, "Failed to update user");
  }

  return {
    error: false,
    message: "Success, details updated!",
  };
};
