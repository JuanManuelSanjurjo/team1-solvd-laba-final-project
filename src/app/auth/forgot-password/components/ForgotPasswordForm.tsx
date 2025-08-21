"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import Input from "@/components/FormElements/Input";
import Button from "@/components/Button";
import forgotPassword, {
  ForgotPasswordResponse,
} from "@/lib/actions/forgot-password";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordSchema, ForgotPasswordFormData } from "../types";
import Toast from "@/components/Toast";

export default function ForgotPasswordForm() {
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
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      const response = await forgotPassword(data);

      if (response.error) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: ({ message }: ForgotPasswordResponse) => {
      setToastContent({
        severity: "success",
        message: message,
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

  const onSubmit = (data: ForgotPasswordFormData) => {
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
        role="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <Input
          {...register("email")}
          label="E-mail"
          name="email"
          type="email"
          required
          placeholder="Enter your registered email address"
          errorMessage={errors.email?.message ?? ""}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
          sx={{
            mt: "24px",
            mb: "16px",
          }}
        >
          Reset password
        </Button>
      </Box>
    </>
  );
}
