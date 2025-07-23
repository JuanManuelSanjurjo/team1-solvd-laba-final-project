"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import Input from "@/components/FormElements/Input";
import Button from "@/components/Button";

const schema = z
  .object({
    name: z.string().min(5, "Name must be at least 5 characters"),
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
          {...register("name")}
          label="Name"
          name="name"
          required
          errorMessage={errors.name?.message ?? ""}
        />
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
        <Input
          {...register("confirmPassword")}
          label="Confirm password"
          type="password"
          name="confirmPassword"
          required
          errorMessage={errors.confirmPassword?.message ?? ""}
          sx={{
            mb: "90px",
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            mb: "16px",
          }}
        >
          Sign Up
        </Button>
      </Box>
    </>
  );
}
