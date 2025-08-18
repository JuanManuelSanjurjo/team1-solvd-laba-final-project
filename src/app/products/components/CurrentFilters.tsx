"use client";
import { Typography, Box } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import FilterChip from "./FilterChip";

/**
 * CurrentFilters component renders a list of filters that are currently applied to the search results.
 * It displays the price range, brand, size, gender, and color filters, and allows the user to remove
 * or change their selections.
 *
 * @param {Object} props - Component props
 * @param {[number, number]} props.priceRange - An array containing the minimum and maximum price values.
 * @param {(priceRange: [number, number]) => void} props.setPriceRange - A function to update the price range.
 *
 * @returns {JSX.Element} A list of filters that are currently applied to the search results.
 */

export default function CurrentFilters({
  priceRange,
  setPriceRange,
}: {
  priceRange: [number, number];
  setPriceRange: (priceRange: [number, number]) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramsToShow = new URLSearchParams(searchParams.toString());
  paramsToShow.delete("searchTerm");
  paramsToShow.delete("page");
  paramsToShow.delete("priceMin");
  paramsToShow.delete("priceMax");
  const filters = Array.from(paramsToShow.entries());
  const isPriceRangeActive = priceRange[0] > 0 || priceRange[1] < 500;
  const emptyFilters = filters.length === 0 && !isPriceRangeActive;

  function handleRemoveFilter(filter: string, value: string) {
    const newSearchParams = new URLSearchParams();

    searchParams.forEach((v, k) => {
      if (v !== value) {
        newSearchParams.append(k, v);
      }
    });

    router.replace(`?${newSearchParams.toString()}`);
  }

  function handleRemovePricerange() {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("priceMin");
    newSearchParams.delete("priceMax");
    router.replace(`?${newSearchParams.toString()}`);
    setPriceRange([0, 500]);
  }

  return (
    <Box
      marginBottom={1}
      sx={{
        display: "flex",
        alignItems: "start",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      {emptyFilters && (
        <Typography
          variant="caption"
          sx={{ fontStyle: "italic", color: "gray" }}
        >
          No filters applied
        </Typography>
      )}
      {filters.length > 0 &&
        filters.map(([filter, value], index) => (
          <FilterChip
            key={index}
            text={value}
            onClick={() => handleRemoveFilter(filter, value)}
          />
        ))}
      {isPriceRangeActive && (
        <FilterChip
          text={`Price: ${priceRange[0]}/${priceRange[1]}`}
          onClick={handleRemovePricerange}
        />
      )}
    </Box>
  );
}
