"use client";
import FilterCheckbox from "@/components/FilterCheckBox";
import { Box, Slider, Typography } from "@mui/material";
import { SearchBar } from "@/components/SearchBar";
import CloseIcon from "@mui/icons-material/Close";
import { FiltersSection } from "./FiltersSection";
import CurrentFilters from "./CurrentFilters";
import useMediaBreakpoints from "@/hooks/useMediaBreakpoints";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface FilterSideBarProps {
  hideDrawer: () => void;
  paginationTotal?: number;
}

export const FilterSideBar: React.FC<FilterSideBarProps> = ({
  hideDrawer,
  paginationTotal,
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
          <Box onClick={hideDrawer} sx={{ marginBottom: "36px" }}>
            <CloseIcon
              sx={{
                width: "20px",
                height: "20px",
                color: "rgba(73, 73, 73, 1)",
                marginRight: "14px",
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
      <FiltersSection label="Kids">
        <FilterCheckbox
          label="Boys"
          checked={searchParams.getAll("gender").includes("Boys")}
          onChange={() => handleFilterChange("gender", "Boys")}
        />
        <FilterCheckbox
          label="Girls"
          checked={searchParams.getAll("gender").includes("Girls")}
          onChange={() => handleFilterChange("gender", "Girls")}
        />
      </FiltersSection>
      <FiltersSection label="Size">
        {[38, 39, 40, 41, 42, 43, 44].map((size) => (
          <FilterCheckbox
            key={size}
            label={size.toString()}
            checked={searchParams.getAll("size").includes(size.toString())}
            onChange={() => handleFilterChange("size", size.toString())}
          />
        ))}
      </FiltersSection>
      <FiltersSection label="Brand">
        <Box sx={{ paddingRight: { xs: "30px" }, marginBottom: "36px" }}>
          <SearchBar size="small" fullWidth />
        </Box>
        <FilterCheckbox
          label="Adidas"
          checked={searchParams.getAll("brand").includes("Adidas")}
          onChange={() => handleFilterChange("brand", "Adidas")}
        />
        <FilterCheckbox
          label="Asics"
          checked={searchParams.getAll("brand").includes("Asics")}
          onChange={() => handleFilterChange("brand", "Asics")}
        />
        <FilterCheckbox
          label="New Balance"
          checked={searchParams.getAll("brand").includes("New Balance")}
          onChange={() => handleFilterChange("brand", "New Balance")}
        />
        <FilterCheckbox
          label="Nike"
          checked={searchParams.getAll("brand").includes("Nike")}
          onChange={() => handleFilterChange("brand", "Nike")}
        />
        <FilterCheckbox
          label="Puma"
          checked={searchParams.getAll("brand").includes("Puma")}
          onChange={() => handleFilterChange("brand", "Puma")}
        />
        <FilterCheckbox
          label="Reebok"
          checked={searchParams.getAll("brand").includes("Reebok")}
          onChange={() => handleFilterChange("brand", "Reebok")}
        />
      </FiltersSection>
      <FiltersSection label="Price">
        <Slider
          value={priceRange}
          sx={{ width: "95%" }}
          onChange={handlePriceChange}
          onChangeCommitted={handlePriceCommit}
          valueLabelDisplay="auto"
          min={0}
          max={500}
          step={10}
        />
      </FiltersSection>
      <FiltersSection label="Color">
        <FilterCheckbox
          label="Black"
          checked={searchParams.getAll("color").includes("Black")}
          onChange={() => handleFilterChange("color", "Black")}
        />
        <FilterCheckbox
          label="Gray"
          checked={searchParams.getAll("color").includes("Gray")}
          onChange={() => handleFilterChange("color", "Gray")}
        />
        <FilterCheckbox
          label="White"
          checked={searchParams.getAll("color").includes("White")}
          onChange={() => handleFilterChange("color", "White")}
        />
      </FiltersSection>
    </Box>
  );
};
