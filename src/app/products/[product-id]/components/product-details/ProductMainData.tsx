import { Box, Typography } from "@mui/material";
import { NormalizedProduct } from "@/types/product-types";

/**
 * ProductMainData
 *
 * This component renders the main data of a product, including the name, price, and color.
 *
 * @returns {JSX.Element} The ProductMainData component.
 *
 * @example
 * <ProductMainData />
 */
export default function ProductMainData({
  product,
}: {
  product: NormalizedProduct;
}) {
  return (
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
            wordBreak: "break-word",
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
          wordBreak: "break-word",
        }}
      >
        {product?.color}
      </Typography>
    </Box>
  );
}
