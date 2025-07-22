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
        flex: "0 0 50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 10%",
      }}
    >
      {children}
    </Box>
  );
}
