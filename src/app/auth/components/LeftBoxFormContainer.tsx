import { Box } from "@mui/material";
import { ReactNode } from "react";

export default function LeftBoxFormContainer({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        flex: {
          xs: "0 0 100%",
          sm: "0 0 100%",
          md: "0 0 100%",
          lg: "0 0 50%",
          xl: "0 0 50%",
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: {
          xs: "0 5%",
          sm: "0 5%",
          md: "0 5%",
          lg: "0 5%",
          xl: "0 10%",
        },
      }}
    >
      {children}
    </Box>
  );
}
