import { Box } from "@mui/material";
import Card from "./Card";
import CardButtonMenu from "./actions/CardButtonMenu";
import CardButtonWishList from "./actions/CardButtonWishList";
import CardOverlayAddToCart from "./actions/CardOverlayAddToCart";
import CardOverlayDelete from "./actions/CardOverlayDelete";
import CardDragAndDrop from "./CardDragAndDrop";
import { JSX } from "react";

interface Product {
  id: number;
  attributes: {
    name: string;
    price: number;
    images: {
      data:
        | {
            attributes: {
              url: string;
            };
          }[]
        | null;
    };
    gender: {
      data: {
        attributes: {
          name: string;
        };
      };
    };
  };
}

interface CardProduct {
  id: number;
  image: string;
  name: string;
  price: number;
  gender: string;
}

type CardContainerProps = {
  products: Product[];
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
  products,
}: CardContainerProps): JSX.Element {
  const cardProducts: CardProduct[] = products.map((product) => ({
    id: product.id,
    image:
      product.attributes.images.data?.[0]?.attributes.url ||
      "https://d2s30hray1l0uq.cloudfront.net/frontend/shoe-photography-featured-image-1024x512.jpg",
    name: product.attributes.name,
    price: product.attributes.price,
    gender: product.attributes.gender?.data?.attributes?.name ?? "No gender",
  }));

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
      {cardProducts.map((product, index) => (
        <Card product={product} action={<CardButtonMenu />} key={index} />
      ))}
      {/*
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
      ))}*/}
      <CardDragAndDrop />
    </Box>
  );
}
