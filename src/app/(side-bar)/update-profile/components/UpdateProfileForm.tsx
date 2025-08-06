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
// import SignUp from "@/actions/sign-up";
import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 5 characters").optional(),
  surname: z.string().min(2, "Name must be at least 5 characters").optional(),
  email: z.email("Invalid email address").optional(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .optional(),
});

type FormData = z.infer<typeof schema>;

export default function UpdateProfileForm() {
  const [open, setOpen] = useState(false);
  const [
    toastContent,
    //setToastContent;
  ] = useState({
    severity: "",
    message: "",
  });
  const { data: session } = useSession();

  const handleClose = (
    _: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const {
    register,
    // handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // const { mutate, isPending } = useMutation({
  //   mutationFn: SignUp,
  //   onSuccess: () => {
  //     setToastContent({
  //       severity: "success",
  //       message: "Succes, details updated!",
  //     });
  //     setOpen(true);
  //   },
  //   onError: (error: Error) => {
  //     setOpen(true);
  //     setToastContent({
  //       severity: "error",
  //       message: error.message,
  //     });
  //   },
  // });

  // const onSubmit = (data: FormData) => {
  //   mutate(data);
  // };

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
        // onSubmit={handleSubmit(onSubmit)}
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
          value={session?.user?.name}
          errorMessage={errors.name?.message ?? ""}
        />
        <Input
          {...register("surname")}
          label="Surname"
          name="surname"
          placeholder={"Surname"}
          errorMessage={errors.surname?.message ?? ""}
        />
        <Input
          {...register("email")}
          label="E-mail"
          name="email"
          value={session?.user?.email}
          errorMessage={errors.email?.message ?? ""}
        />
        {/* Change phone number*/}
        <Input
          {...register("phoneNumber")}
          label="Phone number"
          name="phoneNumber"
          placeholder={"Enter phone number"}
          errorMessage={errors.phoneNumber?.message ?? ""}
        />
        <Button
          type="submit"
          variant="contained"
          // disabled={isPending}
          sx={{ width: "max-content", alignSelf: "flex-end" }}
        >
          Save changes
        </Button>
      </Box>
    </>
  );
}
