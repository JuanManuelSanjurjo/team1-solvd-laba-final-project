import { Box } from "@mui/material";
import { JSX } from "react";

type CardTopRightActionProps = {
  action: JSX.Element;
};

/**
 * CardActionWrapperTopRight
 *
 * This component is a wrapper that displays overlay with an action button on the top right corner of the card.
 *
 * @param action - The JSX element to be displayed on the top right corner of the card.
 * @returns {JSX.Element} with the card top right action component.
 */

export default function CardActionWrapperTopRight({
  action,
}: CardTopRightActionProps): JSX.Element {
  return (
    <Box
      sx={{
        position: "absolute",
        top: {
          xs: 8,
          md: 24,
        },
        right: {
          xs: 8,
          md: 24,
        },
      }}
    >
      {action}
    </Box>
  );
}
