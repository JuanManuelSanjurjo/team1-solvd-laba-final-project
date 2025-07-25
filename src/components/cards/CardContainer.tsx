import { Box } from "@mui/material";
import Card from "./Card";
import CardButtonMenu from "./actions/CardButtonMenu";
import CardButtonWishList from "./actions/CardButtonWishList";
import CardOverlayAddToCart from "./actions/CardOverlayAddToCart";
import CardOverlayDelete from "./actions/CardOverlayDelete";
import CardDragAndDrop from "./CardDragAndDrop";
import { JSX } from "react";

type CardContainerProps = {
  images: string[];
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
  images,
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
      {images.slice(0, 2).map((item, i) => (
        <Card image={item} action={<CardButtonMenu />} key={i} />
      ))}
      {images.slice(2, 4).map((item, i) => (
        <Card image={item} action={<CardButtonWishList />} key={i} />
      ))}
      {images.slice(4, 6).map((item, i) => (
        <Card
          image={item}
          action={<CardOverlayAddToCart />}
          overlay={true}
          key={i}
        />
      ))}
      {images.slice(6, 8).map((item, i) => (
        <Card
          image={item}
          showText={false}
          action={<CardOverlayDelete />}
          overlay={true}
          key={i}
        />
      ))}
      <CardDragAndDrop />
    </Box>
  );
}
