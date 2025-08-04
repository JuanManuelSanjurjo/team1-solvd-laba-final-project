"use client";

import React, { JSX, useDeferredValue, useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Bag, CloseCircle, SearchNormal } from "iconsax-react";
import { SearchBar } from "./SearchBar";
import { ProfilePicture } from "./ProfilePicture";
import { LogoBlackSvg } from "./LogoBlackSvg";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MobileDrawer from "./Navbar/MobileDrawer";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { fetchProductsBySearch } from "@/lib/fetchProductsBySearch";
import CardContainer from "./cards/CardContainer";
import { normalizeProductCard } from "@/lib/normalizeProductCard";
import Card from "./cards/Card";

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

export const Header = (): JSX.Element | null => {
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600–900px
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // >900px

  const [searchInput, setSearchInput] = useState("");
  const deferredSearchInput = useDeferredValue(searchInput);
  const [isSearching, setIsSearching] = useState(false);
  const toggleSearch = () => setIsSearching(!isSearching);

  const { data: searchResults = [] } = useQuery({
    queryKey: ["products", searchInput],
    queryFn: () =>
      fetchProductsBySearch(
        deferredSearchInput,
        ["name", "color.name", "gender.name"],
        ["color.name", "gender.name", "images.url"],
      ),
    enabled: isSearching && deferredSearchInput.length > 1,
  });

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    console.log(searchResults);
  };

  const [open, setOpen] = useState(false);

  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  const toolbarHeight = isMobile ? 60 : isTablet ? 90 : 120;
  const itemGap = isMobile || !isAuthenticated ? 2 : 5;
  const bagIconSize = isMobile ? 20 : 24;
  const searchBarSize = isMobile ? "xsmall" : isTablet ? "medium" : "large";

  const isExcluded = excludedPaths.includes(pathname);
  if (isExcluded) return null;

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{ zIndex: isSearching ? 1205 : 1200 }}
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
          <>
            {!isMobile && (
              <Box position="absolute" left={isMobile ? 24 : 40}>
                <Link href="/products">
                  <LogoBlackSvg />
                </Link>
              </Box>
            )}
            <SearchBar
              onChange={handleSearchInputChange}
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
              <Link href="/">
                <LogoBlackSvg />
              </Link>
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

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: itemGap,
              }}
            >
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
                {isAuthenticated && (
                  <Link href="/cart" style={{ display: "flex" }}>
                    <Bag style={{ width: bagIconSize }} color="#292d32" />
                  </Link>
                )}
                {isAuthenticated && isDesktop && (
                  <ProfilePicture
                    width={24}
                    src="https://www.shareicon.net/data/128x128/2016/07/26/802043_man_512x512.png" //Should be change on NextAuth implementation
                  />
                )}
              </Box>
              {!isDesktop && isAuthenticated && (
                <Box sx={{ display: { xs: "flex", md: "none" } }}>
                  <IconButton
                    sx={{ padding: 0 }}
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleToggleDrawer}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              )}
              {!isAuthenticated && (
                <Link href="/auth/sign-in">
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      padding: "8px 12px ",
                      fontSize: {
                        xs: "0.8rem",
                        md: "1rem",
                      },
                    }}
                  >
                    Sign in
                  </Button>
                </Link>
              )}
            </Box>
          </>
        )}
      </Toolbar>
      {isSearching && (
        <Box
          sx={{
            width: "100%",
            backgroundColor: "white",
            position: "absolute",
            top: isMobile ? 60 : isDesktop ? 120 : 90,
            height: `calc(100vh - ${isMobile ? 60 : isDesktop ? 120 : 90}px)`,
            overflowY: "auto",
          }}
        >
          {isSearching && (
            <CardContainer>
              {normalizeProductCard(searchResults || []).map(
                (product, index) => (
                  <Card
                    product={product}
                    overlayAction="cardOverlayAddToCart"
                    key={index}
                    overlay={true}
                  />
                ),
              )}
            </CardContainer>
          )}
        </Box>
      )}

      <MobileDrawer open={open} handleToggleDrawer={handleToggleDrawer} />
    </AppBar>
  );
};
