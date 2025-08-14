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
        width: { xs: "100%", sm: 223 },
        height: { xs: "auto", sm: 223 },
        overflow: "hidden",
        aspectRatio: "1/1",
      }}
    >
      <Box
        component="img"
        src={image}
        alt={`product-img`}
        sx={{
          objectFit: "cover",
          objectPosition: "center",
          width: "100%",
          height: "100%",
        }}
      />
    </Box>
  );
}
