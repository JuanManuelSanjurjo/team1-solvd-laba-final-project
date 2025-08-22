"use client";

import { Box } from "@mui/material";
import ProductSizes from "./ProductSizes";
import ProdcuctMainData from "./product-details/ProductMainData";
import ProductDescription from "./product-details/ProductDescription";
import ProductPageButtons from "./product-details/ProductPageButtons";
import { JSX, useEffect, useMemo } from "react";
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
  const cardProductInfo: cardProduct = useMemo(
    () => ({
      id: product.id,
      image: product.images?.[0]?.url || "https://placehold.co/400",
      name: product.name,
      price: product.price,
      gender: product.gender,
    }),
    [product]
  );

  const isLoggedIn = Boolean(session?.user);

  const addToRecentlyViewed = useRecentlyViewedStore(
    (state) => state.addToRecentlyViewed
  );

  useEffect(() => {
    if (isLoggedIn) return;
    const userId = session?.user?.id ? String(session.user.id) : null;
    if (!userId) return;
    addToRecentlyViewed(userId, cardProductInfo);
  }, [
    isLoggedIn,
    session?.user?.id,
    product.id,
    addToRecentlyViewed,
    cardProductInfo,
  ]);

  return (
    <Box
      data-testid="product-page-details"
      maxWidth={"520px"}
      width="100%"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <ProdcuctMainData product={product} />
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
