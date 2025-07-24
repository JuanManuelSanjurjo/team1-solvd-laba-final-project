"use client";
import { Typography, Button, Box } from "@mui/material";
import Image from "next/image";
import { JSX } from "react";
import Link from "next/link";

export default function Error(): JSX.Element {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h2">404 Page Not Found</Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ marginTop: "20px" }}
      >
        If you are seeing this message, it means that the page you were trying
        to view does not exist.
      </Typography>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Link href="/">
          <Button variant="contained" color="primary">
            Go back home
          </Button>
        </Link>
      </Box>
      <Image src="/500-page-bg.jpg" alt="404 Error" width={400} height={400} />
    </Box>
  );
}
