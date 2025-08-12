import { Box } from "@mui/material";
import { CloseCircle } from "iconsax-react";
import { SearchBar } from "@/components/SearchBar";
import Link from "next/link";
import { LogoBlackSvg } from "@/components/LogoBlackSvg";
import useMediaBreakpoints from "./hooks/useMediaBreakpoints";

/**
 * SearchingStateHeader
 *
 * This component displays a header with a search bar and a close icon for mobile devices.
 * It includes a search bar, a logo, a search icon, and a close icon.
 *
 * @param {Object} props - The props for the component.
 * @param {boolean} props.isSearching - A boolean value indicating whether the search is active.
 * @param {Function} props.handleSearchInputChange - A function to handle search input changes.
 * @param {Function} props.handleSearchSubmit - A function to handle search submit.
 * @param {Function} props.toggleSearch - A function to toggle the search bar.
 *
 * @returns {JSX.Element} The header component.
 */

export default function SearchingStateHeader({
  isSearching,
  handleSearchInputChange,
  handleSearchSubmit,
  toggleSearch,
}: {
  isSearching: boolean;
  handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  toggleSearch: () => void;
}) {
  const { isMobile, isTablet } = useMediaBreakpoints();
  const searchBarSize = isMobile ? "xsmall" : isTablet ? "medium" : "large";
  return (
    <>
      {!isMobile && (
        <Box position="absolute" left={isMobile ? 24 : 40}>
          <Link href="/products">
            <LogoBlackSvg />
          </Link>
        </Box>
      )}
      <SearchBar
        focus={isSearching}
        onChange={handleSearchInputChange}
        onSubmit={handleSearchSubmit}
        size={searchBarSize}
        fullWidth={isMobile ? true : false}
      />
      <Box
        position={isMobile ? "relative" : "absolute"}
        right={isMobile ? 0 : 40}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
        onClick={toggleSearch}
      >
        <CloseCircle
          style={{
            cursor: "pointer",
            width: isMobile ? 15 : 27,
            marginLeft: isMobile ? 20 : 0,
          }}
          color="#292d32"
        />
      </Box>
    </>
  );
}
