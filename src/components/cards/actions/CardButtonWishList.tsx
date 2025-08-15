"use client";

import { Box } from "@mui/material";
import { HeartSlash, Heart } from "iconsax-react";
import { JSX } from "react";
import { useWishlistStore } from "@/store/wishlist";
import cardProduct from "./types/cardProduct";
import { useSession } from "next-auth/react";

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
}: CardButtonWishListProps): JSX.Element {
  const { data: session } = useSession();

  const userId = String(session?.user.id);
  const byUser = useWishlistStore((state) => state.byUser);
  const addToWishList = useWishlistStore((state) => state.addToWishList);
  const removeFromWishList = useWishlistStore(
    (state) => state.removeFromWishList
  );

  const wishList = byUser[userId] ?? [];
  const isInWisList = wishList.some((prod) => prod.id === product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWisList) {
      removeFromWishList(userId, product.id);
    } else {
      addToWishList(userId, product);
    }
  };

  const IconComponent = isInWisList ? HeartSlash : Heart;

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
      onClick={handleToggle}
    >
      <IconComponent
        size="32"
        color="currentColor"
        className="bg"
        variant={isInWisList ? "Bold" : "Outline"}
      />
    </Box>
  );
}
