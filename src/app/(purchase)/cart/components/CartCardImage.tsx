import { Box } from "@mui/material";
import { JSX } from "react";

type CartCardImageProps = {
  image: string;
};

/**
 * CardImage
 *
 * This component is a container for an image and its children.
 * used in the Card component
 *
 * @param image - The URL of the image to display.
 * @param children - The JSX elements to be displayed inside the image container.
 * @returns {JSX.Element} with the card image component.
 */

export default function CartCardImage({
  image,
}: CartCardImageProps): JSX.Element {
  return (
    <Box
      position="relative"
      sx={{
        width: "100%",
        overflow: "hidden",
        maxHeight: "214px",
      }}
    >
      <Box
        component="img"
        src={image}
        alt={`product-img`}
        sx={{
          objectFit: "contain",
          objectPosition: "center",
          width: "100%",
        }}
      />
    </Box>
  );
}
