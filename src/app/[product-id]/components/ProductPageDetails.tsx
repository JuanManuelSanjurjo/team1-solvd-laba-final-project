import { Box, Typography } from "@mui/material";
import ShoeSizeOption from "@/components/ShoeSizeOption";
import ProductPageButtons from "./ProductPageButtons";
import { JSX } from "react";

type ProductDetails = {
  id: number;
  name: string;
  price: number;
  color: string;
  description: string;
  sizes: object[];
  images: object[];
};

export default function ProductPageDetails({
  product,
}: {
  product: ProductDetails;
}): JSX.Element {
  const sizes = product.sizes?.data?.map(
    (size: object) => size.attributes.value,
  );

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
          {product?.color?.data?.attributes?.name}
        </Typography>
      </Box>
      <Typography variant="subtitle1" color="#494949" sx={{ fontWeight: 500 }}>
        Select Size
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, 82px)",
          justifyContent: "space-between",
          alignItems: "center",
          gap: {
            xs: 1,
            md: 3,
          },
        }}
      >
        {sizes?.map((size: number) => (
          <ShoeSizeOption size={size} key={size} disabled={false} />
        ))}
      </Box>
      <ProductPageButtons />
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
