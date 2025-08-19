"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertProps, Box, Typography } from "@mui/material";
import Input from "@/components/FormElements/Input";
import Button from "@/components/Button";
import Toast from "@/components/Toast";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Session } from "next-auth";
import { updateUser } from "@/actions/update-user";
import { useSession } from "next-auth/react";
import {
  updateProfileSchema,
  UpdateProfileFormData,
  UpdateProfileResponse,
} from "../types";
import { useRouter } from "next/navigation";

export default function UpdateProfileForm({
  session,
}: {
  session: Session | null;
}) {
  const router = useRouter();
  const { update } = useSession();

  const [open, setOpen] = useState(false);
  const [toastContent, setToastContent] = useState({
    severity: "" as AlertProps["severity"],
    message: "",
  });

  const handleClose = () => {
    setOpen(false);
  };

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
      setToastContent({
        severity: "success",
        message: message,
      });
      setOpen(true);
      update({ trigger: "update" });
      router.refresh();
    },
    onError: (error: Error) => {
      setOpen(true);
      setToastContent({
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
      <Toast
        open={open}
        onClose={handleClose}
        severity={toastContent.severity}
        message={toastContent.message}
      />

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
          disabled
          placeholder="Enter your email address (e.g., john@example.com)"
          errorMessage={errors.email?.message ?? ""}
        />
        <Input
          {...register("phoneNumber")}
          label="Phone number"
          name="phoneNumber"
          placeholder="Enter your phone number (e.g., +1 234 567 8900)"
          errorMessage={errors.phoneNumber?.message ?? ""}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isPending || !isChanged}
          sx={{ width: "max-content", alignSelf: "flex-end" }}
        >
          Save changes
        </Button>
      </Box>
    </>
  );
}
