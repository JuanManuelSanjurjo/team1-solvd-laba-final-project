"use client";

import { Box } from "@mui/material";
import ProductSizes from "./ProductSizes";
import ProdcuctMainData from "./product-details/ProductMainData";
import ProductDescription from "./product-details/ProductDescription";
import ProductPageButtons from "./product-details/ProductPageButtons";
import { JSX, useEffect, useMemo } from "react";
import { NormalizedProduct } from "@/types/product-types";
import cardProduct from "@/components/cards/actions/types/cardProduct";
import { useRecentlyViewedStore } from "@/store/recentlyviewed";
import { useSession } from "next-auth/react";

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
}: {
  product: NormalizedProduct;
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

  const { data: session, status } = useSession();
  const addToRecentlyViewed = useRecentlyViewedStore(
    (state) => state.addToRecentlyViewed
  );

  useEffect(() => {
    if (status !== "authenticated") return;
    const userId = session?.user?.id ? String(session.user.id) : null;
    if (!userId) return;
    addToRecentlyViewed(userId, cardProductInfo);
  }, [
    status,
    session?.user?.id,
    product.id,
    addToRecentlyViewed,
    cardProductInfo,
  ]);

  return (
    <Box
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
      <ProductPageButtons product={product} cardProductInfo={cardProductInfo} />
      <ProductDescription product={product} />
    </Box>
  );
}
