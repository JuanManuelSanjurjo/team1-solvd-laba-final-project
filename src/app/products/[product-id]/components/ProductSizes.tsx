"use client";
import { Box, Typography } from "@mui/material";
import ShoeSizeOption from "./ShoeSizeOption";
import { NormalizedProduct } from "@/types/product-types";
import { JSX } from "react";

/**
 * ShoeSizeOptionContainer
 *
 * This component renders a container for the ShoeSizeOption component.
 * It displays the available sizes for the product.
 *
 * @returns {JSX.Element} The ShoeSizeOptionContainer component.
 *
 * @example
 * <ShoeSizeOptionContainer />
 */
export default function ProductSizes({
  product,
  selectedSizes,
  toggleSize,
}: {
  product: NormalizedProduct;
  selectedSizes: number[];
  toggleSize: (size: number) => void;
}): JSX.Element {
  return (
    <>
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
            <ShoeSizeOption
              key={id}
              size={value}
              disabled={false}
              checked={selectedSizes.includes(value)}
              onToggle={toggleSize}
              value={value}
            />
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
    </>
  );
}
