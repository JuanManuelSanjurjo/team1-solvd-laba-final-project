import { Typography } from "@mui/material";
import React, { ReactNode } from "react";

/**
 * ProfileHeaderTitle component that displays a title for the profile header.
 *
 * @component
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The content to be displayed as the title
 * @returns {JSX.Element} The rendered profile header title with the specified content
 */
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
