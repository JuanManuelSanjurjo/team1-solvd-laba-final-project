import { Box } from "@mui/material";
import Card from "./Card";
import CardMenu from "./CardMenu";
import CardWishListButton from "./CardWishListButton";
import CardAddToCart from "./CardAddToCart";
import CardDeleteOverlay from "./CardDeleteOverlay";
import ImageDragAndDrop from "./ImageDragAndDrop";
import { JSX } from "react";

type CardContainerProps = {
  images: string[];
};

/**
 * CardContainer
 *
 * This component is a container for a grid of cards. It uses the Card component to display each card in a grid layout.
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
        justifyContent: "center",
        justifyItems: "center",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          md: "repeat(auto-fit, minmax(240px, 320px))",
        },
        gap: { xs: "16px", md: "70px" },
      }}
    >
      {images.slice(0, 2).map((item, i) => (
        <Card image={item} action={<CardMenu />} key={i} />
      ))}
      {images.slice(2, 4).map((item, i) => (
        <Card image={item} action={<CardWishListButton />} key={i} />
      ))}
      {images.slice(4, 6).map((item, i) => (
        <Card image={item} action={<CardAddToCart />} overlay={true} key={i} />
      ))}
      {images.slice(6, 8).map((item, i) => (
        <Card
          image={item}
          showText={false}
          action={<CardDeleteOverlay />}
          overlay={true}
          key={i}
        />
      ))}
      <ImageDragAndDrop />
    </Box>
  );
}
