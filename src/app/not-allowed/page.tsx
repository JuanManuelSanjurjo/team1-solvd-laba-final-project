"use client";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotAllowed() {
  const text =
    "You need to be logged in to access this page. Please login or sign up.";
  const router = useRouter();
  const [countDown, setCountDown] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDown - 1);
    }, 1000);

    if (countDown === 0) {
      clearInterval(interval);

      router.push("/");
    }

    return () => {
      clearInterval(interval);
    };
  }, [countDown, router]);

  return (
    <Box
      position="relative"
      height={{ xs: "95vh", md: "100vh" }}
      overflow="hidden"
      display="flex"
      flexDirection={{ xs: "column-reverse", md: "row" }}
      sx={{ marginTop: { xs: "60px", sm: "90px", md: 0 } }}
    >
      {/* White background */}
      <Box
        component="div"
        sx={{
          width: { xs: "100%", md: "50%" },
          height: { xs: "30%", md: "100%" },
        }}
      />
      {/* image background */}
      <Box
        data-testid="not-found-background"
        component="div"
        sx={{
          position: "relative",
          width: { xs: "100%", md: "50%" },
          height: "100%",
          background: "white",
          overflow: "hidden",
          "&::after": {
            content: '""',
            backgroundImage: `url(/assets/images/500-page-bg.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
            borderBottomLeftRadius: { xs: "39px", md: "0" },
            borderBottomRightRadius: { xs: "39px", md: "0" },
          },
        }}
      />{" "}
      {/* Extra tile for xs breakpoint*/}
      <Box
        data-testid="not-found-extra-tile"
        display={{ xs: "block", md: "none" }}
        width={"100%"}
        height={140}
        sx={{
          backgroundColor: "#d6d7d9",
        }}
      />
      {/* Floating content */}
      <Box
        position="absolute"
        left={{
          xs: "50%",
          md: "8%",
        }}
        padding="30px 16px"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          textAlign: {
            xs: "center",
            md: "start",
          },
          justifyContent: {
            xs: "space-between",
            md: "center",
          },
          transform: {
            xs: "translateX(-50%)",
            md: "translateX(0%)",
          },
        }}
      >
        <Box
          maxWidth={{ xs: 320, md: "45%" }}
          height="94%"
          position="relative"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: {
              xs: "space-between",
              md: "center",
            },
            justifyItems: {
              xs: "flex-start",
              md: "center",
            },
          }}
        >
          <Typography
            variant="h2"
            fontWeight={500}
            fontSize={{ xs: 30, md: 45 }}
          >
            Ups!
          </Typography>
          <Typography
            variant="body1"
            fontSize={{ xs: 12, md: 20 }}
            mb={2}
            sx={{
              color: "text.secondary",
              marginTop: { xs: 0, md: "20px" },
              fontWeight: 500,
              position: {
                xs: "absolute",
                md: "initial",
              },
              top: {
                xs: "8%",
                md: "initial",
              },
            }}
          >
            {text}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              width: 320,
              gap: 2,
              "& .MuiButton-root": {
                width: "100%",
                fontSize: 16,
                height: 40,
              },
            }}
          >
            <Button variant="contained" component={Link} href="/auth/sign-in">
              Log in
            </Button>
            <Button
              sx={{ width: "100%" }}
              variant="outlined"
              onClick={() => router.push("/")}
            >
              Home ({countDown})
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
