"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import Button from "@/components/Button";
import { useState, useRef, useEffect } from "react";
import { ProfilePicture } from "@/components/ProfilePicture";
import { useMutation } from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";
import {
  AvatarUpdateResponse,
  updateAvatar,
} from "@/lib/actions/update-avatar";
import {
  deleteAvatar,
  DeleteAvatarResponse,
} from "@/lib/actions/delete-avatar";
import { useSession } from "next-auth/react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import {
  avatarSchema,
  AvatarFormData,
  SelectedImageUrl,
  UpdateProfileImageProps,
} from "../types";
import { useToastStore } from "@/store/toastStore";

/**
 * UpdateProfileImage component that allows users to update their profile image.
 * Includes options to upload a new image, delete the current image, and preview the selected image.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Session} props.session - The user session object containing user information
 * @returns {JSX.Element} The rendered update profile image component with the user's profile image
 */
export default function UpdateProfileImage({
  session,
}: UpdateProfileImageProps) {
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const [selectedImageUrl, setSelectedImageUrl] = useState<SelectedImageUrl>(
    session.user.avatar || { id: "", url: "" }
  );

  const hiddenFileInputRef = useRef<HTMLInputElement>(null);
  const { update } = useSession();

  const onSuccessAction = async ({
    message,
    refresh = true,
  }: {
    message: string;
    refresh?: boolean;
  }) => {
    useToastStore.getState().show({
      severity: "success",
      message,
    });

    await update({ trigger: "update" });
    reset();

    if (refresh) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    reset,
  } = useForm<AvatarFormData>({
    resolver: zodResolver(avatarSchema),
  });
  const avatarFiles = watch("avatar");

  const { mutate: updateAvatarMutation, isPending: isUpdating } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await updateAvatar(formData);

      if (response.error) {
        throw new Error(response.message);
      }

      return response;
    },
    mutationKey: ["updateAvatar"],
    onSuccess: ({ data, message }: AvatarUpdateResponse) => {
      if (data) {
        setSelectedImageUrl({ id: data.id, url: data.url });
      }

      onSuccessAction({ message });
    },
    onError: (error: Error) => {
      useToastStore.getState().show({
        severity: "error",
        message: error.message || "Failed to update avatar",
      });
    },
  });

  const { mutate: deleteAvatarMutation, isPending: isDeleting } = useMutation({
    mutationFn: async (
      avatarId: string | null
    ): Promise<DeleteAvatarResponse | void> => {
      const response = await deleteAvatar(avatarId);

      if (response?.error) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: (data: DeleteAvatarResponse | void) => {
      if (!data) {
        return;
      }
      setSelectedImageUrl({ id: "", url: "" });
      onSuccessAction({ message: data.message });
    },
    onError: (error: Error) => {
      useToastStore.getState().show({
        severity: "error",
        message: error.message || "Failed to delete avatar",
      });
    },
  });

  useEffect(() => {
    if (avatarFiles && avatarFiles.length > 0) {
      const file = avatarFiles[0];
      if (file.type === "image/jpeg" || file.type === "image/png") {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImageUrl({ id: "", url: imageUrl });

        return () => {
          URL.revokeObjectURL(imageUrl);
        };
      }
    }
  }, [avatarFiles]);

  const handleChangePhotoClick = () => {
    hiddenFileInputRef.current?.click();
  };

  const { ref: avatarRef, ...avatarRegisterProps } = register("avatar");

  const onSubmit = (data: AvatarFormData) => {
    if (data.avatar && data.avatar.length > 0) {
      const formData = new FormData();
      formData.append("files", data.avatar[0]);
      formData.append("refId", session.user.id);
      updateAvatarMutation(formData);
    } else {
      useToastStore.getState().show({
        severity: "warning",
        message: "Please select an image to upload",
      });
    }
  };

  const handleDeleteAvatar = () => {
    if (selectedImageUrl.id) {
      deleteAvatarMutation(selectedImageUrl.id);
    } else {
      setSelectedImageUrl({ id: "", url: "" });
      onSuccessAction({ message: "No avatar to delete", refresh: false });
    }
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            paddingTop: { xs: "20px", md: "35px" },
            gap: {
              xs: "28px",
              md: "76px",
            },
          }}
        >
          <ProfilePicture
            src={selectedImageUrl.url}
            alt={`${session?.user.username}'s avatar`}
            width={{ xs: 100, md: 150 }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "24px",
            }}
          >
            <input
              type="file"
              {...avatarRegisterProps}
              ref={(e) => {
                avatarRef(e);
                hiddenFileInputRef.current = e;
              }}
              accept=".jpg,.jpeg,.png"
              style={{ display: "none" }}
            />
            <Button
              variant="outlined"
              onClick={handleChangePhotoClick}
              disabled={isUpdating || isDeleting}
            >
              Change photo
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteAvatar}
              disabled={!selectedImageUrl.id || isDeleting || isUpdating}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            {!selectedImageUrl.id && selectedImageUrl.url && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    reset();
                    setSelectedImageUrl(
                      session.user.avatar || { id: "", url: "" }
                    );
                  }}
                  disabled={isUpdating || isDeleting}
                >
                  <CancelRoundedIcon />
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isUpdating || isDeleting}
                >
                  {isUpdating ? (
                    <HourglassEmptyRoundedIcon />
                  ) : (
                    <CheckCircleRoundedIcon />
                  )}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
        {errors.avatar && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {errors.avatar?.message as string}
          </Typography>
        )}
      </Box>
    </>
  );
}
