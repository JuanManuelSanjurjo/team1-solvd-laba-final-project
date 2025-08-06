import { JSX } from "react";
import { Box } from "@mui/material";
import SkeletonCardContainer from "./components/SkeletonCardContainer";
import SidebarSkeleton from "./components/SidebarSkeleton";

export default function Loading(): JSX.Element {
  return (
    <Box
      sx={{
        height: "100vh",
        marginInline: {
          xs: 0,
          md: 5,
        },
        marginBlock: 20,
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "1fr 3fr",
        },
      }}
    >
      <SidebarSkeleton />
      <SkeletonCardContainer />
    </Box>
  );
}
