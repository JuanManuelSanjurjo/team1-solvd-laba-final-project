import { Box } from "@mui/material";
import Image from "next/image";
import { JSX } from "react";

/**
 * Basic Loading component
 * @returns {JSX.Element}
 */
export default function Loading(): JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          animation: "logoFade 2s ease-in-out infinite",
          "@keyframes logoFade": {
            "0%, 100%": {
              opacity: 0.3,
            },
            "50%": {
              opacity: 1,
            },
          },
        }}
      >
        <Image
          src="/assets/logo/logo-orange.svg"
          alt="Loading..."
          width={120}
          height={120}
          priority
        />
      </Box>
    </Box>
  );
}
