import AsideImage from "../components/AsideImage";
import Testimonials from "./components/Testimonials";
import AuthHeader from "../components/AuthHeader";
import MainContainer from "../components/MainContainer";
import LeftBoxFormContainer from "../components/LeftBoxFormContainer";
import AuthLogo from "../components/AuthLogo";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import SignUpForm from "./components/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

export default function SignUp() {
  return (
    <MainContainer>
      <AuthLogo />
      <LeftBoxFormContainer>
        <AuthHeader
          title="Create an account"
          subtitle="Create an account to get an easy access to your dream shopping"
        />
        <SignUpForm />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Already have an account?{" "}
            <Typography
              component={Link}
              href="/auth/sign-in"
              sx={{
                fontWeight: 600,
                color: "primary.main",
                textDecoration: "none",
              }}
            >
              Log in
            </Typography>
          </Typography>
        </Box>
      </LeftBoxFormContainer>
      <AsideImage imageUrl="/assets/images/auth-aside.jpg" alt="Sneakers image">
        <Testimonials variant="testimonials" />
      </AsideImage>
    </MainContainer>
  );
}
