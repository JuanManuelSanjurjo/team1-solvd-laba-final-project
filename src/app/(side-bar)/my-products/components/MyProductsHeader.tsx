import { Box, Typography, Button } from "@mui/material";
import { JSX } from "react";
import Link from "next/link";

/**
 * MyPorductsHeader
 *
 * This component renders the header section of the My Products page.
 * It includes a title and an optional add product button.
 *
 * @component
 *
 * @param {boolean} isEmpty - Whether the list of products is empty.
 *
 * @returns {JSX.Element} The header section of the My Products page.
 */
export default function MyProductsHeader({
  isEmpty,
}: {
  isEmpty: boolean;
}): JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="h2"
        fontWeight={500}
        sx={{
          fontSize: {
            xs: 30,
            md: 40,
          },
        }}
      >
        My Products
      </Typography>
      {!isEmpty && (
        <Button
          component={Link}
          href="/my-products/add-product"
          variant="contained"
          sx={{ height: "40px" }}
        >
          Add Product
        </Button>
      )}
    </Box>
  );
}
