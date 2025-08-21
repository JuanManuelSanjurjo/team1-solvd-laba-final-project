"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, Box } from "@mui/material";
import Input from "@/components/form-elements/Input";
import Button from "@/components/Button";
import resetPassword, {
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "@/lib/actions/reset-password";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordSchema, ResetPasswordFormData } from "../types";
import Toast from "@/components/Toast";

export function transformResetPasswordData(
  formData: ResetPasswordFormData
): ResetPasswordPayload {
  return {
    password: formData.password,
    passwordConfirmation: formData.confirmPassword,
    code: formData.code,
  };
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

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
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: code || "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (code) {
      setValue("code", code);
    }
  }, [code, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      data: ResetPasswordFormData
    ): Promise<ResetPasswordResponse> => {
      const payload = transformResetPasswordData(data);
      const response = await resetPassword(payload);

      if (response.error) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: (res: ResetPasswordResponse) => {
      setToastContent({
        severity: "success",
        message: res.message,
      });
      setToastOpen(true);

      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 2000);
    },
    onError: (error: Error) => {
      setToastOpen(true);
      setToastContent({
        severity: "error",
        message: error.message,
      });
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    mutate(data);
  };

  if (!code) {
    return (
      <Alert severity="error" sx={{ width: "100%" }}>
        Invalid or missing reset code. Please check your email link and try
        again.
      </Alert>
    );
  }

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
        <input type="hidden" {...register("code")} />

        <Input
          {...register("password")}
          label="Password"
          type="password"
          name="password"
          required
          placeholder="Enter your new password"
          errorMessage={errors.password?.message ?? ""}
        />
        <Input
          {...register("confirmPassword")}
          label="Confirm password"
          type="password"
          name="confirmPassword"
          required
          placeholder="Re-enter your new password"
          errorMessage={errors.confirmPassword?.message ?? ""}
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
