import { Box, Skeleton } from "@mui/material";
import { JSX } from "react";

/**
 * CardSkeleton component that displays a skeleton for a product card.
 *
 * @component
 * @returns {JSX.Element} The rendered card skeleton component
 */
export default function CardSkeleton(): JSX.Element {
  return (
    <Box
      data-testid="card-skeleton"
      sx={{
        height: { xs: 210, md: 375 },
        width: {
          xs: 152,
          md: 320,
        },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        sx={{ borderRadius: 1 }}
      />
      <Skeleton variant="text" width="100%" height="30px" />
      <Skeleton variant="text" width="100%" height="30px" />
    </Box>
  );
}
