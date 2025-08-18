import { Typography } from "@mui/material";
import React, { ReactNode } from "react";

export default function ProfileHeaderTitle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Typography
      variant="h2"
      sx={{
        fontSize: {
          xs: 30,
          md: 40,
        },
        paddingBottom: "35px",
      }}
    >
      {children}
    </Typography>
  );
}
