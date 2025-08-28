"use client";
import { useState, useMemo, useCallback } from "react";
import { Box } from "@mui/material";
import { useSearchParams } from "next/navigation";
import FilterCheckbox from "@/components/FilterCheckBox";
import { SearchBar } from "@/components/SearchBar";
import useDebounce from "@/hooks/useDebounce";
import { FiltersSection } from "./FiltersSection";

interface FilterOption {
  value: number;
  label: string;
}

interface FilterSectionWithSearchProps {
  label: string;
  filterKey: string;
  options: FilterOption[];
  placeholder?: string;
  showSearch?: boolean;
  checked?: (value: string) => boolean;
  onFilterChange: (filterType: string, value: string) => void;
}

/**
 * FilterSectionWithSearch component that displays a filter section with a search bar.
 *
 * @component
 * @param {FilterSectionWithSearchProps} props - Props for the component
 * @param {string} props.label - Label for the filter section.
 * @param {string} props.filterKey - Key for the filter.
 * @param {FilterOption[]} props.options - Options for the filter.
 * @param {string} props.placeholder - Placeholder for the search bar.
 * @param {boolean} props.showSearch - Boolean that represents if the search bar is shown.
 * @param {function} props.checked - Function that is called to check if an option is checked.
 * @param {function} props.onFilterChange - Function that is called when the filter is changed.
 * @returns {JSX.Element} The rendered filter section with search component
 */
export const FilterSectionWithSearch: React.FC<
  FilterSectionWithSearchProps
> = ({
  label,
  filterKey,
  options,
  placeholder = `Search ${label.toLowerCase()}...`,
  showSearch = true,
  checked,
  onFilterChange,
}) => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredOptions = useMemo(() => {
    if (!showSearch || !debouncedSearchTerm.trim()) {
      return options;
    }
    return options.filter((option) =>
      option.label.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [options, debouncedSearchTerm, showSearch]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    []
  );

  const isChecked = useCallback(
    (value: string) => {
      if (checked) {
        return checked(value);
      }
      return searchParams.getAll(filterKey).includes(value);
    },
    [checked, searchParams, filterKey]
  );

  return (
    <FiltersSection label={label}>
      {showSearch && (
        <Box sx={{ paddingRight: { xs: "30px" }, marginBottom: "36px" }}>
          <SearchBar
            size="small"
            fullWidth
            placeholder={placeholder}
            onChange={handleSearchChange}
          />
        </Box>
      )}
      {filteredOptions.map((option) => {
        return (
          <FilterCheckbox
            key={option.value}
            label={option.label}
            checked={isChecked(option.label)}
            onChange={() => onFilterChange(filterKey, option.label)}
          />
        );
      })}
    </FiltersSection>
  );
};
