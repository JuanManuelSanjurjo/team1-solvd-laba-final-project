import { Box } from "@mui/material";
import { JSX } from "react";
import CardOverlayDelete from "@/components/cards/actions/CardOverlayDelete";
import CardImage from "@/components/cards/CardImage";
import CardActionWrapperCenter from "@/components/cards/wrappers/CardActionWrapperCenter";
import cardProduct from "@/components/cards/actions/types";

type CardProps = {
  product?: cardProduct;
  image?: string;
  overlayAction?: string;
  onDeletePreview?: () => void;
};

/**
 * Card
 *
 * This component displays an image with an optional overlay action to delete it.
 * @param onDeletePreview delete callback.
 * @param product - Optional product to display with name, price, and description.
 * @param image - Optional image to show if no product is provided.
 * @param overlayAction - Action to show in the center overlay .
 * @returns {JSX.Element}
 */
export default function RemovableImage({
  product,
  image,
  overlayAction = undefined,
  onDeletePreview = () => {},
}: CardProps): JSX.Element {
  const displayImage = product?.image || image;

  return (
    <Box
      sx={{
        position: "relative",
        transition: "opacity 0.2s ease",
        height: { xs: 210, md: 445 },
        width: {
          xs: 152,
          md: 320,
        },
        display: "flex",
        flexDirection: "column",
        "&:hover ": {
          opacity: 0.8,
        },
        "&:hover .overlay": {
          opacity: 1,
        },
      }}
    >
      <CardImage image={displayImage || "No image available"}>
        <>
          {overlayAction && (
            <CardActionWrapperCenter
              action={<CardOverlayDelete onDeletePreview={onDeletePreview!} />}
            />
          )}
        </>
      </CardImage>
    </Box>
  );
}
