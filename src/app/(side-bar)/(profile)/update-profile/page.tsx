import { Box } from "@mui/material";
import UpdateProfileForm from "./components/UpdateProfileForm";
import { auth } from "@/auth";
import UpdateProfileImage from "./components/UpdateProfileImage";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import ProfileHeaderTitle from "../components/ProfileHeaderTitle";

export const metadata: Metadata = {
  title: "Profile",
};

/**
 * UpdateProfile page that allows users to update their profile information.
 * Includes options to update username, first name, last name, email, and phone number.
 *
 * @component
 * @returns {JSX.Element} The rendered update profile page with the user's profile information
 */
export default async function UpdateProfile() {
  const session = await auth();

  if (session === null) {
    redirect("/auth/sign-in");
  }

  return (
    <Box width={{ xs: 320, md: 436 }}>
      <ProfileHeaderTitle>My Profile</ProfileHeaderTitle>
      <UpdateProfileImage session={session} />
      <UpdateProfileForm session={session} />
    </Box>
  );
}
