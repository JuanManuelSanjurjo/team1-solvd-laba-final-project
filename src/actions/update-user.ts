"use server";

import { auth } from "@/auth";
import {
  UpdateProfileFormData,
  UpdateProfileResponse,
} from "@/app/(side-bar)/(profile)/update-profile/types";
import { handleApiError } from "@/lib/normalizers/handle-api-error";

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
