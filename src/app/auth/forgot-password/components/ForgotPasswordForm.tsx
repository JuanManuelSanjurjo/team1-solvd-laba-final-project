"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import Input from "@/components/FormElements/Input";
import Button from "@/components/Button";

const schema = z.object({
  email: z.email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
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
          sx={{
            mb: "16px",
          }}
        />
      </Box>
      <Button type="submit" variant="contained">
        Reset password
      </Button>
    </>
  );
}
