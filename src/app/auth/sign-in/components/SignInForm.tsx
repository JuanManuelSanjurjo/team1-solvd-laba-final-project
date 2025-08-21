"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import Input from "@/components/FormElements/Input";
import Button from "@/components/Button";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import signInAction from "@/lib/actions/sign-in";
import { signInSchema, SignInFormData, SignInResponse } from "../types";
import Toast from "@/components/Toast";

export default function SignInForm() {
  const router = useRouter();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastContent, setToastContent] = useState({
    severity: "success" as "success" | "error",
    message: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      rememberMe: false,
    },
    mode: "onBlur",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SignInFormData): Promise<SignInResponse> => {
      const response = await signInAction(data);

      if (response.error) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: ({ message }: SignInResponse) => {
      setToastOpen(true);
      setToastContent({
        severity: "success",
        message: message,
      });

      router.push("/products");
      router.refresh();
    },
    onError: (error: Error) => {
      setToastOpen(true);
      setToastContent({
        severity: "error",
        message: error.message,
      });
    },
  });

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const onSubmit = (data: SignInFormData) => {
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
          placeholder="Enter your email address"
          errorMessage={errors.email?.message ?? ""}
        />
        <Input
          {...register("password")}
          label="Password"
          type="password"
          name="password"
          required
          placeholder="Enter your password"
          errorMessage={errors.password?.message ?? ""}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: "56px",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                {...register("rememberMe")}
                disableRipple
                sx={{
                  pr: "2px",
                }}
              />
            }
            label="Remember me"
            sx={{
              margin: 0,
              "& .MuiFormControlLabel-label": {
                fontWeight: 500,
                color: "text.secondary",
                marginRight: 0,
              },
            }}
          />
          <Typography
            component={Link}
            href="/auth/forgot-password"
            sx={{
              fontWeight: 300,
              color: "primary.main",
              textDecoration: "none",
            }}
          >
            Forgot password?
          </Typography>
        </Box>
        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
          sx={{
            mb: "16px",
          }}
        >
          Sign In
        </Button>
      </Box>
    </>
  );
}
