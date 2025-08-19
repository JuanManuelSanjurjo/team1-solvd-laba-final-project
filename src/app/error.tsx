"use client";
import { JSX } from "react";
import ErrorPageFloatingContent from "@/components/errors/ErrorPageFloatingContent";
import { Box } from "@mui/material";

export default function Error(): JSX.Element {
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
          display: {
            xs: "block",
            md: "none",
          },
        }}
      />
      {/* image background */}
      <Box
        component="div"
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: "white",
          overflow: "hidden",
          backgroundImage: `url(/assets/images/404-page-bg.png)`,
          backgroundSize: "cover",
          backgroundPosition: {
            xs: "70% center",
            md: "center",
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
          display: {
            xs: "block",
            md: "none",
          },
        }}
      />
      {/* Floating content */}
      <ErrorPageFloatingContent />
    </Box>
  );
}
