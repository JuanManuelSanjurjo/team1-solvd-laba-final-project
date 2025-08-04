import { Box } from "@mui/material";
import CardSkeleton from "./CardSkeleton";

export default function SkeletonCardContainer() {
  return (
    <Box
      sx={{
        paddingBlock: 0,
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
      {Array.from({ length: 7 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </Box>
  );
}
