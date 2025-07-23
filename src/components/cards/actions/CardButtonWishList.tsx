import { Box } from "@mui/material";
import { HeartSlash } from "iconsax-react";
import { JSX } from "react";

/**
 * CardButtonWishList
 *
 * This component is a button that, when clicked, adds the item to the wishlist.
 * Is passed to the Card component to be rendered on top of the image.
 *
 * @returns {JSX.Element} with the card whish list button component.
 */

export default function CardButtonWishList(): JSX.Element {
  return (
    <Box
      sx={{
        color: "#292D32",
        cursor: "pointer",
        ".bg": {
          backgroundColor: "rgba(255,255,255,24%)",
          p: 1,
          borderRadius: 2,
        },
        "&:hover": {
          color: "#FE645E",
          "& .bg": {
            backgroundColor: "white",
          },
        },
      }}
    >
      <HeartSlash size="32" color="currentColor" className="bg" />
    </Box>
  );
}
