import { Session } from "next-auth";
import { z } from "zod";

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .regex(/^\S*$/, "Username cannot contain spaces"),
  firstName: z
    .string()
    .min(5, "First name must be at least 5 characters")
    .optional(),
  lastName: z
    .string()
    .min(5, "Last name must be at least 5 characters")
    .optional(),
  email: z.email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const avatarSchema = z.object({
  avatar: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        if (typeof files === "object" && files.length > 0) {
          const file = files[0];
          return file.type === "image/jpeg" || file.type === "image/png";
        }
        return true;
      },
      {
        message: "Only JPG and PNG files are allowed",
      }
    ),
});

export type AvatarFormData = z.infer<typeof avatarSchema>;

export interface SelectedImageUrl {
  id: string;
  url: string;
}

export interface UpdateProfileImageProps {
  session: Session | null;
}

export interface UpdateProfileResponse {
  error: boolean;
  message: string;
}
