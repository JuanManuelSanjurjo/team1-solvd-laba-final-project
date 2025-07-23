"use client";

import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Bag, CloseCircle, HambergerMenu, SearchNormal } from "iconsax-react";
import { SearchBar } from "./SearchBar";
import { ProfilePicture } from "./ProfilePicture";
import { LogoBlackSvg } from "./LogoBlackSvg";

/**
 * Header component displays a responsive top navigation bar with different layouts
 * based on the device screen size (mobile, tablet, desktop).
 *
 * It includes the app logo, search functionality,
 * shopping bag icon, and user profile (if authenticated).
 *
 * Clicking the search icon toggles a search bar.
 *
 *
 * @component
 * @example
 *
 * <Header isAuthenticated={true} />
 *
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isAuthenticated - Whether the user is logged in; determines if profile picture is shown or "Sign in" button.
 *
 * @returns {JSX.Element} The responsive header component.
 */

interface HeaderProps {
  isAuthenticated: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600–900px
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // >900px

  const [isSearching, setIsSearching] = useState(false);
  const toggleSearch = () => setIsSearching(!isSearching);

  const toolbarHeight = isMobile ? 60 : isTablet ? 90 : 120;
  const itemGap = isMobile ? 2.5 : 5;
  const bagIconSize = isMobile ? 20 : 24;
  const searchBarSize = isMobile ? "xsmall" : isTablet ? "medium" : "large";

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar
        disableGutters
        sx={{
          justifyContent: isSearching ? "center" : "space-between",
          pl: isMobile ? "24px" : "40px",
          pr: isMobile ? "24px" : "60px",
          height: toolbarHeight,
          backgroundColor: "white",
        }}
      >
        {isSearching ? (
          <>
            {!isMobile && (
              <Box position="absolute" left={isMobile ? 24 : 40}>
                <LogoBlackSvg />
              </Box>
            )}

            <SearchBar
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
                  width: isMobile ? 15 : 27,
                  marginLeft: isMobile ? 20 : 0,
                }}
                color="#292d32"
              />
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: itemGap,
                position: "relative",
              }}
            >
              <LogoBlackSvg />
              {isDesktop && (
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={600}
                >
                  Products
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: itemGap }}>
              {!isAuthenticated && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    padding: isMobile
                      ? "8px 28px"
                      : isTablet
                      ? "12px 40px"
                      : "16px 52px",
                  }}
                >
                  Sign in
                </Button>
              )}

              <Box
                onClick={toggleSearch}
                sx={{ display: "flex", alignItems: "center" }}
              >
                {isDesktop ? (
                  <SearchBar size="medium" />
                ) : (
                  <SearchNormal style={{ width: 20 }} color="#292d32" />
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Bag style={{ width: bagIconSize }} color="#292d32" />
                {isAuthenticated && isDesktop && (
                  <ProfilePicture
                    width={24}
                    src="https://www.shareicon.net/data/128x128/2016/07/26/802043_man_512x512.png" //Should be change on NextAuth implementation
                  />
                )}
              </Box>
              {!isDesktop && (
                <HambergerMenu style={{ width: 24 }} color="#292d32" />
              )}
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
