"use client";
import { JSX } from "react";
import ErrorPageFloatingContent from "@/components/errors/ErrorPageFloatingContent";
import { Box } from "@mui/material";

export default function Error(): JSX.Element {
  const textContent =
    "We couldn't find the page you were looking for. Try going back or search for other products.";

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
          display: {
            xs: "block",
            md: "none",
          },
        }}
      />
      {/* Floating content */}
      <ErrorPageFloatingContent
        textContent={textContent}
        title="We lost that page"
        type="error"
      />
    </Box>
  );
}
