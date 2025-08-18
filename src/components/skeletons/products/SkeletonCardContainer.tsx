import { Box } from "@mui/material";
import CardSkeleton from "./CardSkeleton";
import { PRODUCTS_PER_PAGE } from "@/lib/constants/globals";

export default function SkeletonCardContainer() {
  return (
    <Box
      sx={{
        paddingBlock: 5,
        display: "grid",
        justifyContent: "center",
        justifyItems: "center",
        alignItems: "center",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          md: "repeat(auto-fit, minmax(240px, 300px))",
        },
        gap: { xs: 0, md: "67px" },
      }}
    >
      {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </Box>
  );
}
