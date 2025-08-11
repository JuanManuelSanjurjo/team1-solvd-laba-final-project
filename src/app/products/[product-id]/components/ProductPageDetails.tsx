"use client";

import { Box, Typography } from "@mui/material";
import ShoeSizeOption from "./ShoeSizeOption";
import ProductPageButtons from "./ProductPageButtons";
import { JSX, useEffect, useMemo } from "react";
import { NormalizedProduct } from "@/types/product-types";
import cardProduct from "@/components/cards/actions/types/cardProduct";
import { useRecentlyViewedStore } from "@/store/recentlyviewed";

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
      image: product.images?.[0]?.url,
      name: product.name,
      price: product.price,
      gender: product.gender,
    }),
    [product],
  );

  const addToRecentlyViewed = useRecentlyViewedStore(
    (state) => state.addToRecentlyViewed,
  );

  useEffect(() => {
    addToRecentlyViewed(cardProductInfo);
  }, [addToRecentlyViewed, cardProductInfo]);

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
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "flex-end",
            },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 500,
            }}
          >
            {product?.name}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 500,
              textWrap: "nowrap",
              lineHeight: "3rem",
            }}
          >
            $ {product?.price}
          </Typography>
        </Box>
        <Typography
          variant="h4"
          color="#A29F9F"
          sx={{
            fontWeight: 500,
            lineHeight: "24px",
          }}
        >
          {product?.color}
        </Typography>
      </Box>
      <Typography variant="subtitle1" color="#494949" sx={{ fontWeight: 500 }}>
        Select Size
      </Typography>
      {product.sizes?.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, 82px)",
            justifyContent:
              product.sizes?.length > 3 ? "space-between" : "flex-start",
            alignItems: "center",
            gap: {
              xs: 1,
              md: 3,
            },
          }}
        >
          {product.sizes?.map(({ value, id }) => (
            <ShoeSizeOption size={value} key={id} disabled={false} />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#dddddd",
            borderRadius: 2,
            padding: 4,
          }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            No sizes available
          </Typography>
        </Box>
      )}
      <ProductPageButtons product={product} cardProductInfo={cardProductInfo} />
      <Typography variant="subtitle1" color="#494949" sx={{ fontWeight: 500 }}>
        Description
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          lineHeight: "24px",
          fontSize: { xs: "14px", sm: "16px", md: "16px" },
        }}
      >
        {product?.description}
      </Typography>
    </Box>
  );
}
