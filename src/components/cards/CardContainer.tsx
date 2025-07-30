import { Box } from "@mui/material";
import Card from "./Card";
import CardDragAndDrop from "./CardDragAndDrop";
import { JSX } from "react";
import { Product } from "@/types/product";

type CardContainerProps = {
  products?: Product[];
  topAction: string;
  overlayAction?: string;
  isDragAndDropEnable?: boolean;
};

/**
 * CardContainer
 *
 * This component is a container for a grid of cards. It uses the Card component to display each card in a grid layout.
 * currrent content is hardcoded for testing purposes
 *
  @component
 *
 * @param products - Array of product objects to render.
 * @param topAction - Type of top-right action to display on each card (e.g. "cardButtonMenu", "cardButtonWishList", etc).
 * @param overlayAction - Optional type of overlay action to display at the center of the card.
 * @param isDragAndDropEnable - Optional flag to include a `CardDragAndDrop` component at the end of the grid.
 * @returns {JSX.Element} with the card container component.
 */

export default function CardContainer({
  products,
  topAction,
  overlayAction,
  isDragAndDropEnable = false,
}: CardContainerProps): JSX.Element {
  return (
    <Box
      sx={{
        paddingBlock: 4.5,
        //display: "grid",
        display: "flex",
        flexWrap: "wrap",
        //justifyContent: "space-around",
        justifyContent: "center",
        justifyItems: "center",
        /*gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          md: "repeat(auto-fit, minmax(240px, 300px))",
        },*/
        gap: { xs: "16px", md: "67px" },
      }}
    >
      {products &&
        products.map((product) => (
          <Card
            key={product.id}
            product={product}
            topAction={topAction}
            overlayAction={overlayAction}
          ></Card>
        ))}
      {isDragAndDropEnable && <CardDragAndDrop />}
    </Box>
  );
}
