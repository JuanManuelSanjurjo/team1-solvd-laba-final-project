"use client";
import { useState } from "react";
import { Box } from "@mui/material";
import MyProductsEmptyState from "./MyProductsEmptyState";
import MyProductsHeader from "./MyProductsHeader";

/**
 * MyProductsMainContent
 *
 * This component renders the main content of the My Products page.
 * It includes a header, a list of products, and an empty state.
 *
 * @component
 *
 * @returns {JSX.Element} The main content of the My Products page.
 */
export default function MyProductsMainContent() {
  const [products] = useState([]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "50vh",
        marginInline: { xs: "20px", lg: 0 },
      }}
    >
      <MyProductsHeader isEmpty={products.length === 0} />
      {/* CONDITIONAL RENDERING OF PRODUCT LIST HEADER OR EMPTY STATE */}
      {products.length > 0 ? (
        <Box m={10}>Actual fetch of my products</Box>
      ) : (
        <MyProductsEmptyState />
      )}
    </Box>
  );
}
