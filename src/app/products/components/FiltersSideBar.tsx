"use client";
import FilterCheckbox from "@/components/FilterCheckBox";
import { Box, Slider, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FiltersSection } from "./FiltersSection";
import CurrentFilters from "./CurrentFilters";
import useMediaBreakpoints from "@/hooks/useMediaBreakpoints";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FilterSectionWithSearch } from "./FilterSectionWithSearch";

interface FilterSideBarProps {
  hideDrawer: () => void;
  paginationTotal?: number;
  brandOptions: { value: number; label: string }[];
  colorOptions: { value: number; label: string }[];
  sizeOptions: { value: number; label: number }[];
  categoryOptions: { value: number; label: string }[];
}

export const FilterSideBar: React.FC<FilterSideBarProps> = ({
  hideDrawer,
  paginationTotal,
  colorOptions,
  sizeOptions,
  categoryOptions,
  brandOptions,
}: FilterSideBarProps) => {
  const { isMobile } = useMediaBreakpoints();
  const searchParams = useSearchParams();
  const router = useRouter();

  const minPrice = Number(searchParams.get("priceMin")) || 0;
  const maxPrice = Number(searchParams.get("priceMax")) || 500;
  const searchTerm = searchParams.get("searchTerm");

  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const existingValues = params.getAll(filterType);
    params.delete("page");
    const isSelected = existingValues.includes(value);

    if (isSelected) {
      const newValues = existingValues.filter((v) => v !== value);
      params.delete(filterType);
      newValues.forEach((v) => params.append(filterType, v));
    } else {
      params.append(filterType, value);
    }

    router.replace(`?${params.toString()}`);
  };

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange(newValue as [number, number]);
    }
  };

  const handlePriceCommit = (
    _: Event | React.SyntheticEvent,
    newValue: number | number[],
  ) => {
    if (!Array.isArray(newValue)) return;

    const [min, max] = newValue;
    const params = new URLSearchParams(searchParams.toString());

    params.set("priceMin", min.toString());
    params.set("priceMax", max.toString());

    router.replace(`?${params.toString()}`);
  };

  const handleClearAllFilters = () => {
    setPriceRange([0, 500]);
    router.replace("/products");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: "100%",
      }}
    >
      <Box
        sx={{
          paddingLeft: { xs: "30px", md: "40px" },
          paddingTop: { xs: "25px", md: "40px" },
          paddingBottom: { xs: "46", md: "8px" },
          display: "flex",
          flexDirection: { xs: "row", sm: "column" },
          justifyContent: { xs: "flex-end", md: "center" },
        }}
      >
        {!isMobile ? (
          <>
            <CurrentFilters
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
            <Typography
              variant="h3"
              color="theme.primary"
              width="10ch"
              sx={{
                wordBreak: "break-word",
              }}
            >
              {searchTerm
                ? searchTerm + ` (${paginationTotal || "0"})`
                : "Filters"}
            </Typography>
          </>
        ) : (
          <Box
            onClick={hideDrawer}
            sx={{
              marginBottom: "20px",
            }}
          >
            <CloseIcon
              sx={{
                width: "20px",
                height: "20px",
                color: "rgba(73, 73, 73, 1)",
                marginRight: "14px",
                cursor: "pointer",
              }}
            />
          </Box>
        )}
      </Box>

      <FiltersSection label="Gender">
        <FilterCheckbox
          label="Women"
          checked={searchParams.getAll("gender").includes("Women")}
          onChange={() => handleFilterChange("gender", "Women")}
        />
        <FilterCheckbox
          label="Men"
          checked={searchParams.getAll("genre").includes("Men")}
          onChange={() => handleFilterChange("genre", "Men")}
        />
      </FiltersSection>
      <FiltersSection label="Category">
        {categoryOptions.map((category, idx) => (
          <FilterCheckbox
            key={idx}
            label={category.label.toString()}
            checked={searchParams.getAll("categories").includes(category.label)}
            onChange={() => handleFilterChange("categories", category.label)}
          />
        ))}
      </FiltersSection>
      <FiltersSection label="Size">
        {sizeOptions.map((size, idx) => (
          <FilterCheckbox
            key={idx}
            label={size.label.toString()}
            checked={searchParams
              .getAll("size")
              .includes(size.label.toString())}
            onChange={() => handleFilterChange("size", size.label.toString())}
          />
        ))}
      </FiltersSection>
      <FilterSectionWithSearch
        label="Brand"
        filterKey="brand"
        options={brandOptions}
        placeholder="Search brand..."
        onFilterChange={handleFilterChange}
      />
      <FiltersSection label="Price">
        <Slider
          value={priceRange}
          sx={{ width: "94%" }}
          onChange={handlePriceChange}
          onChangeCommitted={handlePriceCommit}
          valueLabelDisplay="auto"
          min={0}
          max={500}
          step={10}
        />
      </FiltersSection>
      <FilterSectionWithSearch
        label="Color"
        filterKey="color"
        options={colorOptions}
        placeholder="Search color..."
        checked={(value) => searchParams.getAll("color").includes(value)}
        onFilterChange={handleFilterChange}
      />

      <Box
        sx={{
          paddingLeft: { xs: "30px", md: "40px" },
          paddingRight: { xs: "30px", md: "40px" },
          paddingTop: "20px",
          paddingBottom: { xs: "30px", md: "40px" },
        }}
      >
        {isMobile && (
          <CurrentFilters
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        )}
        <Button
          variant="outlined"
          fullWidth
          onClick={handleClearAllFilters}
          sx={{
            borderColor: "theme.primary",
            color: "theme.primary",
            "&:hover": {
              borderColor: "theme.primary",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Clear All Filters
        </Button>
      </Box>
    </Box>
  );
};
