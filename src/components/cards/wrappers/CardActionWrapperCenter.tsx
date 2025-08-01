import { Box } from "@mui/material";
import { JSX } from "react";

type CardImageOverlayProps = {
  action: JSX.Element;
};

/**
 * CardActionWrapperCenter
 *
 * This component is a wrapper that displays overlay with an action button on the center of the image.
 *
 * @param action - The JSX element to be displayed on the center of the image.
 * @returns {JSX.Element} with the card image overlay component.
 */

export default function CardActionWrapperCenter({
  action,
}: CardImageOverlayProps): JSX.Element {
  return (
    <Box
      className="overlay"
      sx={{
        position: "absolute",
        inset: 0,
        opacity: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        pointerEvents: "none",
        "& > *": {
          pointerEvents: "auto",
        },
      }}
    >
      {action}
    </Box>
  );
}
