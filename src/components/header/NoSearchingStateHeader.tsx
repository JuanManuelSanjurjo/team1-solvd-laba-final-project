import { Box, Typography, Tooltip, Button } from "@mui/material";
import { Bag, SearchNormal } from "iconsax-react";
import { SearchBar } from "@/components/SearchBar";
import { LogoBlackSvg } from "@/components/LogoBlackSvg";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DesktopProfileMenu from "./DesktopProfileMenu";
import useMediaBreakpoints from "./hooks/useMediaBreakpoints";
import Link from "next/link";
import { Session } from "next-auth";

/**
 * NoSearchingStateHeader
 *
 * This component displays a header with a search bar and a profile menu for desktop devices.
 * It includes a search bar, a logo, a search icon, and a profile menu.
 *
 * @param {Object} props - The props for the component.
 * @param {Session | null} props.session - The session object for the user.
 * @param {Function} props.toggleSearch - A function to toggle the search bar.
 * @param {Function} props.handleToggleDrawer - A function to toggle the drawer.
 *
 * @returns {JSX.Element} The header component.
 */

export default function NoSearchingStateHeader({
  session,
  toggleSearch,
  handleToggleDrawer,
}: {
  session: Session | null;
  toggleSearch: () => void;
  handleToggleDrawer: () => void;
}) {
  const { isMobile, isDesktop } = useMediaBreakpoints();

  const isAuthenticated = Boolean(session);

  const itemGap = isMobile || !session ? 2 : 5;
  const bagIconSize = isMobile ? 20 : 24;

  return (
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
          <Typography variant="body1" color="text.primary" fontWeight={600}>
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
            <SearchNormal
              style={{ width: 20, cursor: "pointer" }}
              color="#292d32"
            />
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isAuthenticated && (
            <Tooltip title={"Cart"}>
              <Link href="/cart" style={{ display: "flex" }}>
                <Bag style={{ width: bagIconSize }} color="#292d32" />
              </Link>
            </Tooltip>
          )}
          {isAuthenticated && isDesktop && <DesktopProfileMenu />}
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
  );
}
