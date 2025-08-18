import { Typography } from "@mui/material";
import { NormalizedProduct } from "@/types/product-types";
import { JSX } from "react";

/**
 * ProductDescription
 *
 * This component renders the description of a product.
 *
 * @returns {JSX.Element} The ProductDescription component.
 *
 * @example
 * <ProductDescription />
 */
export default function ProductDescription({
  product,
}: {
  product: NormalizedProduct;
}): JSX.Element {
  return (
    <>
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
    </>
  );
}
