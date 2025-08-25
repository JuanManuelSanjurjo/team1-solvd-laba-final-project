import { Box, Skeleton } from "@mui/material";

/**
 * SkeletonGallery
 *
 * This component is a skeleton gallery that displays a thumbnail stack and a main image.
 *
 * @returns {JSX.Element} with the skeleton gallery component.
 */

export default function SkeletonProductDetails() {
  return (
    <Box
      maxWidth={"520px"}
      width="100%"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      data-testid="skeleton-product-details"
    >
      {/* Title and Price */}
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "flex-end",
            },
            flexDirection: { xs: "column", md: "row" },
            gap: 1,
          }}
        >
          <Skeleton width="70%" height={40} animation="wave" variant="text" />
          <Skeleton width={80} height={40} animation="wave" variant="text" />
        </Box>
        <Skeleton width="40%" height={30} animation="wave" sx={{ mt: 1 }} />
      </Box>

      {/* Size Label */}
      <Skeleton width="100px" height={30} animation="wave" />

      {/* Sizes Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, 82px)",
          justifyContent: "space-between",
          alignItems: "center",
          gap: {
            xs: 1,
            md: 3,
          },
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton
            key={i}
            animation="wave"
            width={82}
            height={50}
            variant="rectangular"
            sx={{
              borderRadius: 1,
            }}
          />
        ))}
      </Box>

      {/* Action Buttons */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "26px",
          marginTop: 4,
          "& button": {
            width: "100%",
            fontWeight: 500,
            height: "60px",
          },
        }}
      >
        <Skeleton width="100%" height={80} animation="wave" />
        <Skeleton width="100%" height={80} animation="wave" />
      </Box>
      {/* Description */}
      <Skeleton width="100px" height={30} animation="wave" variant="text" />
      <Skeleton width="100%" height={80} animation="wave" variant="text" />
    </Box>
  );
}
