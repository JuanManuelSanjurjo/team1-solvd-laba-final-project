import { Box } from "@mui/material";
import { JSX } from "react";

type CardImageProps = {
  image: string;
  children: JSX.Element;
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

export default function CardImage({
  image,
  children,
}: CardImageProps): JSX.Element {
  return (
    <Box
      position="relative"
      sx={{
        width: {
          xs: 152,
          md: 320,
        },
        height: {
          xs: 170,
          md: 380,
        },
      }}
    >
      <Box
        component="img"
        src={image}
        alt={`main-img`}
        sx={{
          objectFit: "cover",
          objectPosition: "center",
          width: "100%",
          height: {
            xs: 170,
            md: 380,
          },
        }}
      />
      {children}
    </Box>
  );
}
