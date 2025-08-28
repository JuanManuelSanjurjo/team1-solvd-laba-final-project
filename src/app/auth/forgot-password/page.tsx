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
  title: "Forgot Password",
};

/**
 * ForgotPassword component that displays the forgot password page.
 *
 * @component
 * @returns {JSX.Element} The rendered forgot password page component
 */
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
        <Typography
          component={Link}
          href="/auth/sign-in"
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
      </LeftBoxFormContainer>
      <AsideImage
        imageUrl="/assets/images/sign-in-aside.jpg"
        alt="Sneakers image"
      ></AsideImage>
    </MainContainer>
  );
}
