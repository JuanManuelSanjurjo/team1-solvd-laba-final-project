import { Box } from "@mui/material";
import Card from "./Card";
import CardDragAndDrop from "./CardDragAndDrop";
import { JSX } from "react";

type CardContainerProps = {
  images: string[];
  overlayAction: string;
  isDragAndDropEnable?: boolean;
};

/**
 * CardContainer
 *
 * This component is a container for a grid of cards of images. It uses the Card component to display each card in a grid layout.
 *
  @component
 *
 * @param images - Array of images to render.
 * @param overlayAction - type of overlay action to display at the center of the card.
 * @param isDragAndDropEnable - Optional flag to include a `CardDragAndDrop` component at the end of the grid.
 * @returns {JSX.Element} with the card container component.
 */

export default function CardContainer({
  images,
  overlayAction,
  isDragAndDropEnable = false,
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
      {images &&
        images.map((image, index) => (
          <Card key={index} image={image} overlayAction={overlayAction}></Card>
        ))}
      {isDragAndDropEnable && <CardDragAndDrop />}
    </Box>
  );
}
