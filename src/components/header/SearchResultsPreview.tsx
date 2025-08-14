import { Product } from "@/types/product";
import SearchResultItem from "./SearchResultItem";
import { Box, Collapse, Typography } from "@mui/material";
import { normalizeProductCard } from "@/lib/normalizers/normalize-product-card";
import { Bag } from "iconsax-react";

type SearchResultsPreviewProps = {
  products: Product[];
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
};

/**
 * SearchResultsPreview
 *
 * This component displays a search results preview with a product card for each product.
 * It includes a bag icon, a message, and a button to add a product.
 *
 * @param {Object} props - The props for the component.
 * @param {Object} props.products - The products to display.
 * @param {boolean} props.isSearching - A boolean value indicating whether the search is active.
 * @param {Function} props.setIsSearching - A function to set the search state.
 *
 * @returns {JSX.Element} The search results preview component.
 */

export default function SearchResultsPreview({
  products,
  isSearching,
  setIsSearching,
}: SearchResultsPreviewProps) {
  return (
    <>
      <Collapse in={isSearching}>
        <Box
          zIndex={1300}
          width="100%"
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.6)",
            backgroundColor: "white",
          }}
        >
          <>
            {products.length > 0 ? (
              <>
                {normalizeProductCard(products).map((product) => (
                  <SearchResultItem
                    product={product}
                    setIsSearching={setIsSearching}
                    key={product.id}
                  />
                ))}
              </>
            ) : (
              <Box
                sx={{
                  padding: 8,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Bag size={20} color="#292d32" />
                <Typography
                  variant="subtitle2"
                  sx={(theme) => ({
                    color: theme.palette.text.secondary,
                  })}
                >
                  No results found
                </Typography>
              </Box>
            )}
          </>
        </Box>
      </Collapse>
      <Box
        height="100vh"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(4px)",
        }}
        onClick={() => setIsSearching(false)}
      />
    </>
  );
}
