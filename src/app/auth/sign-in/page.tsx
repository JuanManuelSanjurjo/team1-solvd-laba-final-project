import AsideImage from "../components/AsideImage";
import AuthHeader from "../components/AuthHeader";
import MainContainer from "../components/MainContainer";
import LeftBoxFormContainer from "../components/LeftBoxFormContainer";
import AuthLogo from "../components/AuthLogo";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import SignInForm from "./components/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Sign In | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
};

export default function SignIn() {
  return (
    <MainContainer>
      <AuthLogo />
      <LeftBoxFormContainer>
        <AuthHeader
          title="Welcome back"
          subtitle="Welcome back! Please enter your details to log into your account."
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SignInForm />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Don&apos;t have an account?{" "}
            <Typography
              component={Link}
              href="/auth/sign-up"
              sx={{
                fontWeight: 600,
                color: "primary.main",
                textDecoration: "none",
              }}
            >
              Sign up
            </Typography>
          </Typography>
        </Box>
      </LeftBoxFormContainer>
      <AsideImage
        imageUrl="/assets/images/sign-in-aside.jpg"
        alt="Sneakers image"
      ></AsideImage>
    </MainContainer>
  );
}
