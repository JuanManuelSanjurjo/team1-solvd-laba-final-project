import { Box } from "@mui/material";
import { JSX } from "react";

type CardContainerProps = {
  children: React.ReactNode;
};

/**
 * CardContainer
 *
 * This component is a container for a grid of cards. It uses the Card component to display each card in a grid layout.

  @component
 *
 * @param {React.ReactNode} children
 * @returns {JSX.Element} with the card container component.
 */

export default function CardContainer({
  children,
}: CardContainerProps): JSX.Element {
  return (
    <Box
      sx={{
        paddingBlock: 4.5,
        display: "grid",
        justifyContent: "space-around",
        justifyItems: "center",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          md: "repeat(auto-fit, minmax(240px, 300px))",
        },
        gap: { xs: "32px", md: "67px" },
      }}
    >
      {children}
    </Box>
  );
}
