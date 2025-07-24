"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import Input from "@/components/FormElements/Input";
import Button from "@/components/Button";
import Link from "next/link";

const schema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <>
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
            {...register("rememberMe")}
            control={
              <Checkbox
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
