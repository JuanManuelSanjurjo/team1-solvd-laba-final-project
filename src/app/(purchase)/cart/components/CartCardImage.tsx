import { Box } from "@mui/material";
import { JSX } from "react";

type CartCardImageProps = {
  image: string | undefined;
};

/**
 * Image container component for displaying product images within cart cards.
 * Handles image loading errors with fallback placeholder and maintains aspect ratio.
 *
 * @component
 * @param {CartCardImageProps} props - The component props
 * @param {string | undefined} props.image - The URL of the image to display
 * @returns {JSX.Element} The rendered image container with responsive sizing
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
        src={image || "/assets/images/placeholders/70x70.svg"}
        alt={`product-img`}
        onError={(e) => {
          e.currentTarget.src = "/assets/images/placeholders/70x70.svg";
        }}
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
