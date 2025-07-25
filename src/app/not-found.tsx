"use client";
import { Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { JSX } from "react";

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
            backgroundImage: `url(/500-page-bg.jpg)`,
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
      <FloatingContent />
    </Box>
  );
}

function FloatingContent(): JSX.Element {
  return (
    <Box
      position="absolute"
      left={{
        xs: "50%",
        md: 25,
      }}
      height="100%"
      padding="40px 16px"
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
      <Box maxWidth={{ xs: 320, md: "45%" }}>
        <Typography variant="h2" fontWeight={500} fontSize={{ xs: 30, md: 45 }}>
          Error 404
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ marginTop: "20px" }}
          fontSize={{ xs: 12, md: 20 }}
          mb={2}
        >
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
          nonummy nibh euismod tincidunt ut laoreet dolore magna
        </Typography>
      </Box>
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
        <Link href="/" style={{ width: "100%" }}>
          <Button variant="outlined">Go back</Button>
        </Link>
        <Link href="/" style={{ width: "inherit" }}>
          <Button variant="contained">Home</Button>
        </Link>
      </Box>
    </Box>
  );
}
