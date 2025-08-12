import { Product } from "@/types/product";
import SearchResultItem from "./SearchResultItem";
import { Box, Collapse, Typography } from "@mui/material";
import { normalizeProductCard } from "@/lib/normalizers/normalizeProductCard";
import { Bag } from "iconsax-react";

type SearchResultsPreviewProps = {
  products: Product[];
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
};

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
