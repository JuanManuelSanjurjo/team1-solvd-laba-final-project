import { Product } from "@/types/product";
import SearchResultItem from "./SearchResultItem";
import { Box, Typography } from "@mui/material";
import { normalizeProductCard } from "@/lib/normalizers/normalize-product-card";
import { Bag } from "iconsax-react";
import AiButton from "../AiButton";

type SearchResultsPreviewProps = {
  products: Product[];
  setIsSearching: (value: boolean) => void;
  aiLoading: boolean;
  generateFiltersWithAi: () => void;
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
  setIsSearching,
  aiLoading,
  generateFiltersWithAi,
}: SearchResultsPreviewProps) {
  return (
    <>
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
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
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
              <AiButton
                onGenerate={generateFiltersWithAi}
                isLoading={aiLoading}
                size="small"
                label="Use smart search"
              />
            </Box>
          )}
        </>
      </Box>
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
