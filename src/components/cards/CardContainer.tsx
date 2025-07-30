import { Box } from "@mui/material";
import Card from "./Card";
import CardButtonMenu from "./actions/CardButtonMenu";
import CardButtonWishList from "./actions/CardButtonWishList";
import CardOverlayAddToCart from "./actions/CardOverlayAddToCart";
import CardOverlayDelete from "./actions/CardOverlayDelete";
import CardDragAndDrop from "./CardDragAndDrop";
import { JSX, ReactElement } from "react";
import { Product } from "@/types/product";

interface CardProduct {
  id: number;
  image: string;
  name: string;
  price: number;
  gender: string;
}

type CardContainerProps = {
  children: React.ReactNode;
};

/**
 * CardContainer
 *
 * This component is a container for a grid of cards. It uses the Card component to display each card in a grid layout.
 * currrent content is hardcoded for testing purposes
 *
 * @param images - An array of images .
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
        gap: { xs: "16px", md: "67px" },
      }}
    >
      {children}
    </Box>
  );
}
