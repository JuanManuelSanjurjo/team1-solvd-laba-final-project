import { Box } from "@mui/material";
import { ReactNode } from "react";

/**
 * LeftBoxFormContainer component that wraps the form container on the left side of the authentication page.
 *
 * @component
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The child elements to be rendered inside the container
 * @returns {JSX.Element} The rendered left box form container component
 */
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
