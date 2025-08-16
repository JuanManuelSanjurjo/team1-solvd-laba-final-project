import AsideImage from "../components/AsideImage";
import AuthHeader from "../components/AuthHeader";
import MainContainer from "../components/MainContainer";
import LeftBoxFormContainer from "../components/LeftBoxFormContainer";
import AuthLogo from "../components/AuthLogo";
import { Typography } from "@mui/material";
import Link from "next/link";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Forgot Password | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
};

export default function ForgotPassword() {
  return (
    <MainContainer>
      <AuthLogo />
      <LeftBoxFormContainer>
        <AuthHeader
          title="Forgot password?"
          subtitle="Don't worry, we'll send you reset instructions."
        />
        <ForgotPasswordForm />
        <Link href="/auth/sign-in">
          <Typography
            component="p"
            sx={{
              fontWeight: 500,
              color: "text.secondary",
              textDecoration: "none",
              textAlign: "center",
              mt: "20px",
            }}
          >
            Back to login
          </Typography>
        </Link>
      </LeftBoxFormContainer>
      <AsideImage
        imageUrl="/assets/images/sign-in-aside.jpg"
        alt="Sneakers image"
      ></AsideImage>
    </MainContainer>
  );
}
