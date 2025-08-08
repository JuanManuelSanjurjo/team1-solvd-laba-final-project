import { Box } from "@mui/material";
import { JSX } from "react";

type CardContainerProps = {
  children: React.ReactNode;
  length?: number;
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
  length,
}: CardContainerProps): JSX.Element {
  return (
    <Box
      sx={{
        paddingBlock: 4.5,
        display: "grid",
        justifyContent: !length
          ? "space-around"
          : {
              xs: length > 1 ? "space-around" : "flex-start",
              md: length > 2 ? "space-around" : "flex-start",
            },
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
