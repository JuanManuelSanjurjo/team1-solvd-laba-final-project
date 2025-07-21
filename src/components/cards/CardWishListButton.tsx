import { Box } from "@mui/material";
import { HeartSlash } from "iconsax-react";
import { JSX } from "react";

/**
 * CardWhishListButton
 *
 * This component is a button that, when clicked, adds the item to the wishlist.
 *
 * @returns {JSX.Element} with the card whish list button component.
 */

export default function CardWhishListButton(): JSX.Element {
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
