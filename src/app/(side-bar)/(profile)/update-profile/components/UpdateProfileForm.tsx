"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import Input from "@/components/form-elements/Input";
import Button from "@/components/Button";
import { useMutation } from "@tanstack/react-query";
import { Session } from "next-auth";
import { updateUser } from "@/lib/actions/update-user";
import { useSession } from "next-auth/react";
import {
  updateProfileSchema,
  UpdateProfileFormData,
  UpdateProfileResponse,
} from "../types";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/store/toastStore";

export default function UpdateProfileForm({
  session,
}: {
  session: Session | null;
}) {
  const router = useRouter();
  const { update } = useSession();

  const defaultValues = {
    username: session?.user?.username,
    firstName: session?.user?.firstName || "",
    lastName: session?.user?.lastName || "",
    email: session?.user?.email,
    phoneNumber: session?.user?.phone || "",
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
    mode: "onBlur",
  });

  const isChanged = JSON.stringify(watch()) !== JSON.stringify(defaultValues);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateProfileFormData) => {
      const response = await updateUser(data, session?.user.id || "");

      if (response.error) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: ({ message }: UpdateProfileResponse) => {
      useToastStore.getState().show({
        severity: "success",
        message,
      });
      update({ trigger: "update" });
      router.refresh();
    },
    onError: (error: Error) => {
      useToastStore.getState().show({
        severity: "error",
        message: error.message,
      });
    },
  });

  const onSubmit = (data: UpdateProfileFormData) => {
    mutate(data);
  };

  return (
    <>
      <Typography variant="body2" paddingBlock="26px">
        Welcome back! Please enter your details to log into your account.
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <Input
          {...register("username")}
          label="Username"
          name="username"
          data-testid="username-input"
          placeholder="Enter your unique username (min. 8 characters)"
          errorMessage={errors.username?.message ?? ""}
        />
        <Input
          {...register("firstName")}
          label="First name"
          name="firstName"
          placeholder="Enter your first name"
          errorMessage={errors.firstName?.message ?? ""}
        />
        <Input
          {...register("lastName")}
          label="Last name"
          name="lastName"
          placeholder="Enter your last name"
          errorMessage={errors.lastName?.message ?? ""}
        />
        <Input
          {...register("email")}
          value={session?.user?.email}
          label="E-mail"
          name="email"
          data-testid="email-input"
          disabled
          placeholder="Enter your email address (e.g., john@example.com)"
          errorMessage={errors.email?.message ?? ""}
        />
        <Input
          {...register("phoneNumber")}
          label="Phone number"
          name="phoneNumber"
          data-testid="phoneNumber-input"
          placeholder="Enter your phone number (e.g., +1 234 567 8900)"
          errorMessage={errors.phoneNumber?.message ?? ""}
        />
        <Button
          type="submit"
          variant="contained"
          data-testid="save-button"
          name="save-button"
          disabled={isPending || !isChanged}
          sx={{ width: "max-content", alignSelf: "flex-end" }}
        >
          Save changes
        </Button>
      </Box>
    </>
  );
}
