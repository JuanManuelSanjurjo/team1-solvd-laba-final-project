"use client";

import { Box } from "@mui/material";
import { HeartSlash } from "iconsax-react";
import { JSX } from "react";
import { useWishlistStore } from "@/store/wishlist";
import cardProduct from "./types/cardProduct";

type CardButtonWishListProps = {
  product: cardProduct;
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
}: CardButtonWishListProps): JSX.Element | null {
  const { wishList, addToWishList, removeFromWishList } = useWishlistStore();
  const isInWisList = wishList.some((prod) => prod.id === product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWisList) {
      removeFromWishList(product.id);
    } else {
      addToWishList(product);
    }
  };

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
        variant={isInWisList ? "Bold" : "Outline"}
        onClick={handleToggle}
      />
    </Box>
  );
}
