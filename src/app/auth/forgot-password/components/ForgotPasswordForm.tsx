"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import Input from "@/components/form-elements/Input";
import Button from "@/components/Button";
import forgotPassword, {
  ForgotPasswordResponse,
} from "@/lib/actions/forgot-password";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordSchema, ForgotPasswordFormData } from "../types";
import { useToastStore } from "@/store/toastStore";

/**
 * ForgotPasswordForm component that displays the forgot password form.
 *
 * @component
 * @returns {JSX.Element} The rendered forgot password form component
 */
export default function ForgotPasswordForm() {
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
      useToastStore.getState().show({
        severity: "success",
        message: message,
      });
    },
    onError: (error: Error) => {
      useToastStore.getState().show({
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
