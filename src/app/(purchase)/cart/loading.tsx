"use client";
import { Box, Typography, Divider, Skeleton } from "@mui/material";

/**
 * Loading skeleton component for the cart page.
 * Displays placeholder content while the cart data is being fetched.
 * Shows skeleton loaders for cart items and checkout summary in a responsive layout.
 *
 * @component
 * @returns {JSX.Element} The rendered loading skeleton with cart item placeholders and summary
 */
export default function Loading() {
  return (
    <Box
      sx={{
        width: "90%",
        height: "100%",
        margin: "auto",
        marginTop: "160px",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-evenly",
      }}
    >
      {/* Products */}
      <Box sx={{ marginTop: "80px", width: { xs: "100%", sm: "40%" } }}>
        <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 45 }, mb: 3 }}>
          Cart
        </Typography>

        {[1, 2].map((number) => (
          <Box key={number}>
            <Box
              sx={{
                display: "flex",
                paddingBlock: { xs: "15px", sm: "60px" },
                justifyContent: "space-around",
                maxWidth: "963px",
                width: { lg: "65vw", md: "100%" },
                paddingRight: "2rem",
                gap: "5%",
              }}
            >
              <Skeleton
                variant="rectangular"
                sx={{
                  width: { xs: "20%", sm: 223 },
                  height: { xs: "auto", sm: 223 },
                  overflow: "hidden",
                  aspectRatio: "1/1",
                }}
              />

              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="30%" height={20} />
              </Box>

              {/* Price skeleton */}
              <Skeleton variant="text" width={60} height={30} />
            </Box>

            <Divider />
          </Box>
        ))}
      </Box>

      {/* Summary */}
      <Box
        sx={{
          marginTop: "80px",
          width: { sm: "25%", xs: "100%" },
        }}
      >
        <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 45 }, mb: 3 }}>
          Summary
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Skeleton variant="text" width="30%" height={30} />
          <Skeleton variant="text" width="20%" height={30} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Skeleton variant="text" width="30%" height={30} />
          <Skeleton variant="text" width="20%" height={30} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Skeleton variant="text" width="30%" height={30} />
          <Skeleton variant="text" width="20%" height={30} />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Skeleton variant="text" width="30%" height={40} />
          <Skeleton variant="text" width="20%" height={40} />
        </Box>

        <Skeleton variant="rectangular" width="100%" height={50} />
      </Box>
    </Box>
  );
}
