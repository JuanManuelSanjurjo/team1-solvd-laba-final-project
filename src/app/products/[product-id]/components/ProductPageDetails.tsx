"use client";

import { Box } from "@mui/material";
import ProductSizes from "./ProductSizes";
import ProductMainData from "./product-details/ProductMainData";
import ProductDescription from "./product-details/ProductDescription";
import ProductPageButtons from "./product-details/ProductPageButtons";
import { JSX, useEffect } from "react";
import { NormalizedProduct } from "@/types/product-types";
import cardProduct from "@/components/cards/actions/types";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { Session } from "next-auth";

/**
 * ProductPageDetails
 *
 * This component is a detailed view of a product. It displays the product's name, description, price, and sizes.
 *
 * @param {NormalizedProduct} props.product - The product data to be displayed.
 * @returns {JSX.Element} The product details component.
 *
 * @example
 * <ProductPageDetails product={product} />
 */

export default function ProductPageDetails({
  product,
  session,
}: {
  product: NormalizedProduct;
  session: Session | null;
}): JSX.Element {
  const cardProductInfo: cardProduct = {
    id: product.id,
    image: product.images?.[0]?.url || "https://placehold.co/400",
    name: product.name,
    price: product.price,
    gender: product.gender,
  };

  const isLoggedIn = Boolean(session?.user?.email);
  const userId = session?.user?.id ? String(session.user.id) : undefined;

  const addToRecentlyViewed = useRecentlyViewedStore(
    (state) => state.addToRecentlyViewed
  );

  useEffect(() => {
    if (isLoggedIn && userId) {
      addToRecentlyViewed(userId, cardProductInfo);
    }
  }, [
    isLoggedIn,
    userId,
    product.id,
    addToRecentlyViewed,
    product.name,
    product.price,
    product.gender,
    product.images?.[0]?.url,
  ]);

  return (
    <Box
      width="100%"
      sx={{
        maxWidth: {
          xs: "100%",
          md: "520px",
        },
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <ProductMainData product={product} />
      <ProductSizes product={product} />
      <ProductPageButtons
        product={product}
        session={session}
        cardProductInfo={cardProductInfo}
      />
      <ProductDescription product={product} />
    </Box>
  );
}
