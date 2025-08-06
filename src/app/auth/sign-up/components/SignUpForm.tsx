"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Alert,
  AlertProps,
  Box,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import Input from "@/components/FormElements/Input";
import Button from "@/components/Button";
import signUp from "@/actions/sign-up";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

const schema = z
  .object({
    username: z
      .string()
      .min(5, "Username must be at least 5 characters")
      .regex(/^\S*$/, "Username cannot contain spaces"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

export default function SignUpForm() {
  const [open, setOpen] = useState(false);
  const [toastContent, setToastContent] = useState({
    severity: "",
    message: "",
  });

  const handleClose = (
    _: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      setToastContent({
        severity: "success",
        message: "Success! Please confirm your account in your e-mail",
      });
      setOpen(true);
    },
    onError: (error: Error) => {
      setOpen(true);
      setToastContent({
        severity: "error",
        message: error.message,
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const submitData: Omit<FormData, "confirmPassword"> = {
      username: data.username,
      email: data.email,
      password: data.password,
    };
    mutate(submitData);
  };

  return (
    <>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={toastContent.severity as AlertProps["severity"]}
          variant="filled"
          sx={{ width: "100%", color: "primary.contrastText" }}
        >
          {toastContent.message}
        </Alert>
      </Snackbar>
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
          errorMessage={errors.username?.message ?? ""}
        />
        <Input
          {...register("email")}
          label="E-mail"
          name="email"
          type="email"
          required
          errorMessage={errors.email?.message ?? ""}
        />
        <Input
          {...register("password")}
          label="Password"
          type="password"
          name="password"
          required
          errorMessage={errors.password?.message ?? ""}
        />
        <Input
          {...register("confirmPassword")}
          label="Confirm password"
          type="password"
          name="confirmPassword"
          required
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
