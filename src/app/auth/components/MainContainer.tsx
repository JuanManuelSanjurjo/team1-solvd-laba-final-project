import { Container } from "@mui/material";
import { ReactNode } from "react";

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
