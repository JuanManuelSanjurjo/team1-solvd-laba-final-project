import { Container } from "@mui/material";
import { ReactNode } from "react";

/**
 * MainContainer component that wraps the main content container of the authentication page.
 *
 * @component
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The child elements to be rendered inside the container
 * @returns {JSX.Element} The rendered main container component
 */
export default function MainContainer({ children }: { children: ReactNode }) {
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ display: "flex", width: "100vw", height: "100vh" }}
      role="main"
    >
      {children}
    </Container>
  );
}
