"use client";
import { Typography, Box, styled } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Add } from "iconsax-react";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "rgba(150, 150, 150, 0.1)",
  padding: "2px 6px",
  color: theme.palette.text.secondary,
  borderRight: "2px solid rgba(0, 0, 0, 0.1)",
  wordBreak: "keep-all",
  borderRadius: 4,
  cursor: "pointer",
}));

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
          <StyledBox
            key={index}
            onClick={() => handleRemoveFilter(filter, value)}
          >
            <Typography key={index} variant="caption">
              {value}
            </Typography>
            <Add
              color="rgba(92, 92, 92, 1)"
              size={14}
              style={{ transform: "rotate(45deg)", cursor: "pointer" }}
            />
          </StyledBox>
        ))}
      {isPriceRangeActive && (
        <StyledBox onClick={handleRemovePricerange}>
          <Typography variant="caption">
            Price: ${priceRange[0]}/{priceRange[1]}
          </Typography>
          <Add
            color="rgba(92, 92, 92, 1)"
            size={14}
            style={{ transform: "rotate(45deg)", cursor: "pointer" }}
          />
        </StyledBox>
      )}
    </Box>
  );
}
