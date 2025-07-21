import { Box, Typography } from "@mui/material";
import CardImage from "./CardImage";
import CardTopRightAction from "./CardTopRightAction";
import CardImageOverlay from "./CardImageOverlay";
import { JSX } from "react";

type CardProps = {
  image: string;
  action?: JSX.Element;
  overlay?: boolean;
  showText?: boolean;
};

/**
 * Card
 *
 * This component is a card that displays an image, an optional action, and optional text.
 * It can be used as a standalone card or as part of a gallery.
 *
 * @param image - The URL of the image to display in the card.
 * @param action - An optional JSX element to display on the right side of the card.
 * @param overlay - A boolean indicating whether to display an overlay on the image.
 * @param showText - A boolean indicating whether to display the text on the card.
 * @returns {JSX.Element} with the card component.
 */

export default function Card({
  image,
  action = undefined,
  overlay = false,
  showText = true,
}: CardProps): JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        "&:hover .overlay": {
          opacity: 1,
        },
        height: { xs: 210, md: 445 },
        width: {
          xs: 152,
          md: 320,
        },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardImage image={image}>
        <>
          {action && !overlay && <CardTopRightAction action={action} />}
          {action && overlay && <CardImageOverlay action={action} />}
        </>
      </CardImage>
      {showText && (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              maxWidth: "100%",
              textOverflow: "ellipsis",
              fontSize: {
                sx: 10,
                md: 22,
              },
              fontWeight: 500,
            }}
          >
            <Typography
              variant="subtitle1"
              title={"name of the product"}
              noWrap
              sx={{ fontSize: "inherit" }}
            >
              Long shoe Card Subtitle to try elipsis
            </Typography>
            <Typography variant="subtitle1" sx={{ fontSize: "inherit" }}>
              $160
            </Typography>
          </Box>

          <Typography
            variant="body1"
            align="left"
            color={"#5C5C5C"}
            sx={{
              maxWidth: "100%",
              wrap: "no-wrap",
              textOverflow: "ellipsis",
              fontSize: {
                sx: 9,
                md: 18,
              },
            }}
          >
            Man{"'"}s shoes
          </Typography>
        </Box>
      )}
    </Box>
  );
}
