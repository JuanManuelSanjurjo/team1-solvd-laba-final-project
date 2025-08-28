import { useMediaQuery, useTheme } from "@mui/material";

/**
 * useMediaBreakpoints
 *
 * This hook is used to determine the current screen size.
 * It returns an object with boolean values for isMobile, isTablet, and isDesktop.
 */
export default function useMediaBreakpoints(): {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return { isMobile, isTablet, isDesktop };
}
