"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  Alert,
  Snackbar,
  AlertProps,
} from "@mui/material";
import Input from "@/components/FormElements/Input";
import Button from "@/components/Button";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import signInAction from "@/actions/sign-in";

const schema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean(),
});

type FormData = z.infer<typeof schema>;

function cleanUpError(error: string) {
  return error.replace(/Read more at.*/, "").trim();
}

export default function SignInForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [toastContent, setToastContent] = useState({
    severity: "",
    message: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      return await signInAction(data);
    },
    onSuccess: () => {
      setOpen(true);
      setToastContent({
        severity: "success",
        message: "Login successful! Redirecting...",
      });

      router.push("/products");
      router.refresh();
    },
    onError: (error: Error) => {
      setOpen(true);
      setToastContent({
        severity: "error",
        message: cleanUpError(error.message),
      });
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data: FormData) => {
    mutate(data);
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
      >
        <Input
          {...register("email")}
          label="E-mail"
          name="email"
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
              "& .MuiFormControlLabel-label": {
                fontWeight: 500,
                color: "text.secondary",
              },
            }}
          />
          <Link href="/auth/forgot-password" passHref>
            <Typography
              component="span"
              sx={{
                fontWeight: 300,
                color: "primary.main",
                textDecoration: "none",
              }}
            >
              Forgot password?
            </Typography>
          </Link>
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
