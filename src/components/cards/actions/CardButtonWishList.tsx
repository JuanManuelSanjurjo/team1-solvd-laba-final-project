"use client";

import { Product } from "@/types/product";
import { Box } from "@mui/material";
import { HeartSlash } from "iconsax-react";
import { JSX } from "react";
import { useWishlistStore } from "@/store/wishlist";

type CardButtonWishListProps = {
  product: Product;
};

/**
 * CardButtonWishList
 *
 * This component is a button that, when clicked, adds the item to the wishlist.
 * Is passed to the Card component to be rendered on top of the image.
 * @param product - The product to be removed from the wishlist
 * @returns {JSX.Element} with the card whish list button component.
 */

export default function CardButtonWishList({
  product,
}: CardButtonWishListProps): JSX.Element {
  const removeFromWishList = useWishlistStore(
    (state) => state.removeFromWishList
  );
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
      <HeartSlash
        size="32"
        color="currentColor"
        className="bg"
        onClick={() => removeFromWishList(product.id)}
      />
    </Box>
  );
}
