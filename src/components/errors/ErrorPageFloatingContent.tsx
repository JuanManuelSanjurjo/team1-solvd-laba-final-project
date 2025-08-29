"use client";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * ErrorPageFloatingContent component that displays a floating content for error pages.
 *
 * @component
 * @param {Object} props - Props for the component
 * @param {string} props.text - Text to display.
 * @param {string} props.title - Title to display.
 * @param {"not-found" | "error"} props.type - Type of error.
 * @returns {JSX.Element} The rendered error page floating content component
 */
export default function ErrorPageFloatingContent({
  text,
  title,
  type,
}: {
  text: string;
  title: string;
  type: "not-found" | "error";
}) {
  const router = useRouter();
  return (
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
          sx={{
            "&::after": {
              content: type === "error" ? '"..."' : '""',
              display: {
                xs: "none",
                md: "inline",
              },
            },
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          fontSize={{ xs: 12, md: 20 }}
          mb={2}
          sx={{
            color:
              type === "error"
                ? { xs: "white", md: "text.secondary" }
                : "text.secondary",
            marginTop: { xs: 0, md: "20px" },
            fontWeight: 500,
            position: {
              xs: "absolute",
              md: "initial",
            },
            top: {
              xs: type === "error" ? "75%" : "8%",
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
          <Button
            onClick={() => router.back()}
            sx={{ width: "100%" }}
            variant="outlined"
          >
            Go back
          </Button>
          <Button variant="contained" component={Link} href="/">
            Go home
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
