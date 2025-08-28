import { Skeleton } from "@mui/material";
import { JSX } from "react";

/**
 * SidebarSkeleton component that displays a skeleton for the sidebar.
 *
 * @component
 * @returns {JSX.Element} The rendered sidebar skeleton component
 */
export default function SidebarSkeleton(): JSX.Element {
  return (
    <Skeleton
      data-testid="sidebar-skeleton"
      sx={{ borderRadius: 1, display: { xs: "none", md: "block" } }}
      variant="rectangular"
      width="85%"
      height="100%"
    />
  );
}
