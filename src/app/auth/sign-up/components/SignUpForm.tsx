"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import Input from "@/components/form-elements/Input";
import Button from "@/components/Button";
import signUp from "@/lib/actions/sign-up";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signUpSchema, SignUpFormData, SignUpResponse } from "../types";
import Toast from "@/components/Toast";

export default function SignUpForm() {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastContent, setToastContent] = useState({
    severity: "success" as "success" | "error",
    message: "",
  });

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SignUpFormData): Promise<SignUpResponse> => {
      const submitData: Omit<SignUpFormData, "confirmPassword"> = {
        username: data.username,
        email: data.email,
        password: data.password,
      };

      const response = await signUp(submitData);

      if (response.error) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: (data: SignUpResponse) => {
      setToastContent({
        severity: "success",
        message: data.message,
      });
      setToastOpen(true);
    },
    onError: (error: Error) => {
      setToastOpen(true);
      setToastContent({
        severity: "error",
        message: error.message,
      });
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    mutate(data);
  };

  return (
    <>
      <Toast
        open={toastOpen}
        onClose={handleCloseToast}
        severity={toastContent.severity}
        message={toastContent.message}
        autoHideDuration={5000}
      />
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
        role="form"
      >
        <Input
          {...register("username")}
          label="Username"
          name="username"
          required
          placeholder="Choose a unique username"
          errorMessage={errors.username?.message ?? ""}
        />
        <Input
          {...register("email")}
          label="E-mail"
          name="email"
          type="email"
          required
          placeholder="Enter your email address"
          errorMessage={errors.email?.message ?? ""}
        />
        <Input
          {...register("password")}
          label="Password"
          type="password"
          name="password"
          required
          placeholder="Create a strong password"
          errorMessage={errors.password?.message ?? ""}
        />
        <Input
          {...register("confirmPassword")}
          label="Confirm password"
          type="password"
          name="confirmPassword"
          required
          placeholder="Re-enter your password"
          errorMessage={errors.confirmPassword?.message ?? ""}
        />
        <Button
          type="submit"
          variant="contained"
          data-testid="sign-up-button"
          disabled={isPending}
          sx={{
            mt: "90px",
            mb: "16px",
          }}
        >
          Sign Up
        </Button>
      </Box>
    </>
  );
}
