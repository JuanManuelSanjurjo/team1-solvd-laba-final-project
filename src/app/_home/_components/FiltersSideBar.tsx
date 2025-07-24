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

interface FilterSideBarProps {
  hideDrawer: () => void;
}

export const FilterSideBar: React.FC<FilterSideBarProps> = ({ hideDrawer }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
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

        <FiltersSection label="Genre">
          <FilterCheckbox label="Men" checked={false} onChange={() => {}} />
          <FilterCheckbox label="Woman" checked={false} onChange={() => {}} />
        </FiltersSection>
        <FiltersSection label="Kids">
          <FilterCheckbox label="Boys" checked={true} onChange={() => {}} />
          <FilterCheckbox label="Girls" checked={false} onChange={() => {}} />
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
          <FilterCheckbox label="Nike" checked={false} onChange={() => {}} />
          <FilterCheckbox label="Puma" checked={false} onChange={() => {}} />
          <FilterCheckbox label="Reebok" checked={false} onChange={() => {}} />
        </FiltersSection>
        <FiltersSection label="Price">
          <Slider />
        </FiltersSection>
        <FiltersSection label="Color">
          <FilterCheckbox label="White" checked={false} onChange={() => {}} />
          <FilterCheckbox label="Black" checked={false} onChange={() => {}} />
          <FilterCheckbox label="Gray" checked={false} onChange={() => {}} />
          <FilterCheckbox label="Red" checked={false} onChange={() => {}} />
          <FilterCheckbox label="Blue" checked={false} onChange={() => {}} />
          <FilterCheckbox label="Yellow" checked={false} onChange={() => {}} />
          <FilterCheckbox label="Green" checked={false} onChange={() => {}} />
        </FiltersSection>
      </Box>
    </>
  );
};
