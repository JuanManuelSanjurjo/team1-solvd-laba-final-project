"use client";
import { Box, Button } from "@mui/material";
import { useWishlistStore } from "@/store/wishlist";
import { NormalizedProduct } from "@/types/product-types";
import cardProduct from "@/components/cards/actions/types/cardProduct";
import { JSX } from "react";

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
}): JSX.Element {
  const { wishList, addToWishList } = useWishlistStore();

  const isInWisList = wishList.some((prod) => prod.id === product.id);

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
      {!isInWisList && cardProductInfo && (
        <Button
          variant="outlined"
          onClick={() => addToWishList(cardProductInfo)}
        >
          Add to wishlist
        </Button>
      )}
      <Button variant="contained">Add to cart</Button>
    </Box>
  );
}
