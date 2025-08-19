"use client";
import { Box } from "@mui/material";
import { JSX } from "react";
import ErrorPageFloatingContent from "@/components/errors/ErrorPageFloatingContent";

export default function NotFound(): JSX.Element {
  return (
    <Box
      position="relative"
      height={"100vh"}
      overflow="hidden"
      display="flex"
      flexDirection={{ xs: "column-reverse", md: "row" }}
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
        display={{ xs: "block", md: "none" }}
        width={"100%"}
        height={140}
        sx={{
          backgroundColor: "#d6d7d9",
        }}
      />
      {/* Floating content */}
      <ErrorPageFloatingContent />
    </Box>
  );
}
