import AsideImage from "../components/AsideImage";
import AuthHeader from "../components/AuthHeader";
import MainContainer from "../components/MainContainer";
import LeftBoxFormContainer from "../components/LeftBoxFormContainer";
import AuthLogo from "../components/AuthLogo";
import { Typography } from "@mui/material";
import Link from "next/link";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { Suspense } from "react";

function ResetPasswordWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

export default function ResetPassword() {
  return (
    <MainContainer>
      <AuthLogo />
      <LeftBoxFormContainer>
        <AuthHeader
          title="Reset password"
          subtitle="Please create new password here"
        />
        <ResetPasswordWrapper />
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
        imageUrl="/assets/images/auth-aside.jpg"
        alt="Sneakers image"
      ></AsideImage>
    </MainContainer>
  );
}
