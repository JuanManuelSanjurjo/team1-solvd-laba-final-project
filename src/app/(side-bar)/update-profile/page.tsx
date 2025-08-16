import { Box, Typography } from "@mui/material";
import UpdateProfileForm from "./components/UpdateProfileForm";
import { auth } from "@/auth";
import UpdateProfileImage from "./components/UpdateProfileImage";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Profile | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
};

export default async function UpdateProfile() {
  const session = await auth();

  if (session === null) {
    redirect("/auth/sign-in");
  }

  return (
    <Box
      width={"100%"}
      sx={{
        display: "flex",
        justifyContent: { xs: "center", md: "flex-start" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginBlock: 4,
          marginInline: " 40px",
          gap: "24px",
        }}
        width={{ xs: 320, md: 436 }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: {
              xs: 30,
              md: 40,
            },
          }}
        >
          My Profile
        </Typography>
        <UpdateProfileImage session={session} />
        <UpdateProfileForm session={session} />
      </Box>
    </Box>
  );
}
