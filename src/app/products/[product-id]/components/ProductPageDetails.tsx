"use client";

import { Box } from "@mui/material";
import ProductSizes from "./ProductSizes";
import ProdcuctMainData from "./product-details/ProductMainData";
import ProductDescription from "./product-details/ProductDescription";
import ProductPageButtons from "./product-details/ProductPageButtons";
import { JSX, useEffect, useMemo } from "react";
import { NormalizedProduct } from "@/types/product-types";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { Session } from "next-auth";
import CardProduct from "@/components/cards/actions/types";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";

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
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);

  const cardProductInfo: CardProduct = useMemo(
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

  const toggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    const userId = session?.user?.id ? String(session.user.id) : null;

    if (!userId) {
      return;
    }

    selectedSizes.forEach((size) => {
      addItem(userId, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url,
        gender: product.gender,
        size,
        quantity: 1,
      });
    });
  };

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
      <ProductSizes
        product={product}
        toggleSize={toggleSize}
        selectedSizes={selectedSizes}
      />
      <ProductPageButtons
        onAddToCart={handleAddToCart}

        product={product}
        session={session}
        cardProductInfo={cardProductInfo}
      />
      <ProductDescription product={product} />
    </Box>
  );
}
