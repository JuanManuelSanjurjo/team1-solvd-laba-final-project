import { Skeleton } from "@mui/material";
import { JSX } from "react";

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
