"use client";
import FilterCheckbox from "@/components/FilterCheckBox";
import {
  Box,
  Slider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SearchBar } from "@/components/SearchBar";
import CloseIcon from "@mui/icons-material/Close";
import { FiltersSection } from "./FiltersSection";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface FilterSideBarProps {
  hideDrawer: () => void;
}

export const FilterSideBar: React.FC<FilterSideBarProps> = ({ hideDrawer }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const searchParams = useSearchParams();
  const router = useRouter();

  const minPrice = Number(searchParams.get("priceMin")) || 0;
  const maxPrice = Number(searchParams.get("priceMax")) || 500;

  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("searchTerm");
    const existingValues = params.getAll(filterType);
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
      {isDesktop ? (
        <Box
          sx={{
            paddingLeft: "40px",
            paddingTop: "40px",
            paddingBottom: "8px",
          }}
        >
          <Typography
            variant="body2"
            color="theme.secondary"
            marginBottom="8px"
          >
            Shoes/Air Force 1
          </Typography>
          <Typography variant="h3" color="theme.primary">
            Air Force 1 (137)
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            paddingTop: "25px",
            paddingBottom: "46px",
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <Box onClick={hideDrawer}>
            <CloseIcon
              sx={{
                width: "20px",
                height: "20px",
                color: "rgba(73, 73, 73, 1)",
                marginRight: "14px",
              }}
            />
          </Box>
        </Box>
      )}

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
        <FilterCheckbox label="Boys" checked={true} onChange={() => {}} />
        <FilterCheckbox label="Girls" checked={false} onChange={() => {}} />
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
        <FilterCheckbox label="Adidas" checked={false} onChange={() => {}} />
        <FilterCheckbox label="Asics" checked={false} onChange={() => {}} />
        <FilterCheckbox
          label="New Balance"
          checked={false}
          onChange={() => {}}
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
        <FilterCheckbox label="Reebok" checked={false} onChange={() => {}} />
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
