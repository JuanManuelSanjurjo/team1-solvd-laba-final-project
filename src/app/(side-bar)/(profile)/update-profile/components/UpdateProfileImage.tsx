"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertProps, Box, Typography } from "@mui/material";
import Button from "@/components/Button";
import { useState, useRef, useEffect } from "react";
import { ProfilePicture } from "@/components/ProfilePicture";
import Toast from "@/components/Toast";
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

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    reset,
  } = useForm<AvatarFormData>({
    resolver: zodResolver(avatarSchema),
  });
  const router = useRouter();
  const avatarFiles = watch("avatar");

  const [open, setOpen] = useState(false);
  const [toastContent, setToastContent] = useState({
    severity: "" as AlertProps["severity"],
    message: "",
  });

  const handleClose = () => {
    setOpen(false);
  };

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
      setToastContent({
        severity: "success",
        message: message,
      });
      setOpen(true);
      update({ trigger: "update" });

      if (data) {
        setSelectedImageUrl({ id: data.id, url: data.url });
      }

      reset();
      router.refresh();
    },
    onError: (error: Error) => {
      setToastContent({
        severity: "error",
        message: error.message || "Failed to update avatar",
      });
      setOpen(true);
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

      setToastContent({
        severity: "success",
        message: data.message,
      });

      setOpen(true);
      update({ trigger: "update" });
      reset();
      setSelectedImageUrl({ id: "", url: "" });
    },
    onError: (error: Error) => {
      setToastContent({
        severity: "error",
        message: error.message || "Failed to delete avatar",
      });
      setOpen(true);
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
      setToastContent({
        severity: "warning",
        message: "Please select an image to upload",
      });
      setOpen(true);
    }
  };

  const handleDeleteAvatar = () => {
    if (selectedImageUrl.id) {
      deleteAvatarMutation(selectedImageUrl.id);
    } else {
      setSelectedImageUrl({ id: "", url: "" });
      reset();
      setToastContent({
        severity: "info",
        message: "No avatar to delete",
      });
      setOpen(true);
    }
  };

  return (
    <>
      <Toast
        open={open}
        onClose={handleClose}
        severity={toastContent.severity}
        message={toastContent.message}
      />
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
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
