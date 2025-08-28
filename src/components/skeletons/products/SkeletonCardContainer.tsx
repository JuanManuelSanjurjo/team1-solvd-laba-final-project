import { Box } from "@mui/material";
import CardSkeleton from "./CardSkeleton";
import { PRODUCTS_PER_PAGE } from "@/lib/constants/globals";

/**
 * SkeletonCardContainer component that displays a container with skeleton cards.
 *
 * @component
 * @returns {JSX.Element} The rendered skeleton card container component
 */
export default function SkeletonCardContainer() {
  return (
    <Box
      data-testid="skeleton-card-container"
      sx={{
        paddingBlock: 4.5,
        display: "grid",
        justifyContent: !PRODUCTS_PER_PAGE
          ? "space-around"
          : {
              xs: PRODUCTS_PER_PAGE > 1 ? "space-around" : "flex-start",
              md: PRODUCTS_PER_PAGE > 2 ? "space-around" : "flex-start",
            },

        justifyItems: "center",
        alignItems: "center",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          md: "repeat(auto-fit, minmax(240px, 300px))",
        },
        gap: { xs: "32px", md: "67px" },
      }}
    >
      {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </Box>
  );
}
