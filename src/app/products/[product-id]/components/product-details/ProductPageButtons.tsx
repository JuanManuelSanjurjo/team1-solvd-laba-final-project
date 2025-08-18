"use client";
import { Box, Button } from "@mui/material";
import { useWishlistStore } from "@/store/wishlist";
import { NormalizedProduct } from "@/types/product-types";
import cardProduct from "@/components/cards/actions/types/cardProduct";
import { JSX } from "react";
import { useSession } from "next-auth/react";

/**
 * ProductPageButtons
 *
 * This component is a pair of buttons for adding the product to the cart or wishlist.
 * @param {NormalizadProduct} props.product  - The product to be added to the cart.
 * @param {cardProduct} props.cardProductInfo - The product information for the wishlist.
 * @returns {JSX.Element} The product buttons component.
 *
 * @example
 * <ProductPageButtons />
 */

export default function ProductPageButtons({
  product,
  cardProductInfo,
}: {
  product: NormalizedProduct;
  cardProductInfo: cardProduct;
}): JSX.Element | null {
  const { data: session, status } = useSession();

  const byUser = useWishlistStore((state) => state.byUser);
  const addToWishList = useWishlistStore((state) => state.addToWishList);
  const removeFromWishList = useWishlistStore(
    (state) => state.removeFromWishList,
  );

  if (status !== "authenticated") return null;

  const userId = String(session!.user!.id);
  const wishList = byUser[userId] ?? [];
  const isInWishList = wishList.some((prod) => prod.id === product.id);

  const handleWishlistClick = () => {
    if (isInWishList) {
      removeFromWishList(userId, product.id);
    } else {
      addToWishList(userId, cardProductInfo);
    }
  };

  const wishlistButtonText = isInWishList
    ? "Remove from wishlist"
    : "Add to wishlist";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "26px",
        marginTop: 4,
        "& button": {
          width: "100%",
          fontWeight: 500,
          height: "60px",
        },
      }}
    >
      {cardProductInfo && (
        <Button
          disabled={status !== "authenticated"}
          variant="outlined"
          onClick={handleWishlistClick}
        >
          {wishlistButtonText}
        </Button>
      )}
      <Button disabled={status !== "authenticated"} variant="contained">
        Add to cart
      </Button>
    </Box>
  );
}
