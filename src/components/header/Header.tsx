"use client";

import { AppBar, Toolbar } from "@mui/material";
import useMediaBreakpoints from "./hooks/useMediaBreakpoints";
import useHeaderSearch from "./hooks/useHeaderSearch";
import { JSX } from "react";
import MobileDrawer from "./MobileDrawer";
import SearchingStateHeader from "./SearchingStateHeader";
import NoSearchingStateHeader from "./NoSearchingStateHeader";
import { usePathname } from "next/navigation";
import SearchResultsPreview from "./SearchResultsPreview";
import { Session } from "next-auth";

const excludedPaths = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/reset-password",
];

/**
 * Header component displays a responsive top navigation bar with different layouts
 * based on the device screen size (mobile, tablet, desktop).
 *
 * It includes the app logo, search functionality,
 * shopping bag icon, and user profile (if authenticated).
 *
 * Clicking the search icon toggles a search bar.
 *
 * @component
 * @example
 *
 * <Header />
 *
 *
 * @param {Object} props - Component props
 *
 * @returns {JSX.Element} The responsive header component.
 */

export const Header = ({
  session,
}: {
  session: Session | null;
}): JSX.Element | null => {
  const {
    isSearching,
    setIsSearching,
    searchInput,
    toggleSearch,
    handleEscapeKey,
    handleSearchInputChange,
    handleSearchSubmit,
    handleToggleDrawer,
    open,
    searchResults,
  } = useHeaderSearch();
  const pathname = usePathname();
  const { isMobile, isTablet } = useMediaBreakpoints();

  const toolbarHeight = isMobile ? 60 : isTablet ? 90 : 120;

  const isExcluded = excludedPaths.includes(pathname);
  if (isExcluded) return null;

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{ overflow: "hidden", zIndex: isSearching ? 1205 : 1200 }}
      onKeyDown={handleEscapeKey}
    >
      <Toolbar
        disableGutters
        sx={{
          justifyContent: isSearching ? "center" : "space-between",
          pl: isMobile ? "24px" : "40px",
          pr: isMobile ? "24px" : "60px",
          height: toolbarHeight,
          backgroundColor: "white",
          borderBottom: "1px solid #eaecf0",
        }}
      >
        {isSearching ? (
          <SearchingStateHeader
            isSearching={isSearching}
            handleSearchInputChange={handleSearchInputChange}
            handleSearchSubmit={handleSearchSubmit}
            toggleSearch={toggleSearch}
          />
        ) : (
          <NoSearchingStateHeader
            toggleSearch={toggleSearch}
            handleToggleDrawer={handleToggleDrawer}
            session={session}
          />
        )}
      </Toolbar>

      {isSearching && searchInput.length > 0 && (
        <SearchResultsPreview
          products={searchResults}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
        />
      )}

      <MobileDrawer
        session={session}
        open={open}
        handleToggleDrawer={handleToggleDrawer}
      />
    </AppBar>
  );
};
