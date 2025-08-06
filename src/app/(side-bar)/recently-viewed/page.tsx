"use client";
import Card from "@/components/cards/Card";
import CardContainer from "@/components/cards/CardContainer";
import { useRecentlyViewedStore } from "@/store/recentlyviewed";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export default function RecentlyViewed() {
  const [isHydrated, setIsHydrated] = useState(false);
  const recentlyViewed = useRecentlyViewedStore(
    (state) => state.recentlyViewed
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography
          variant="h4"
          sx={{
            marginTop: "40px",
            fontSize: { xs: 20, md: 30 },
          }}
        >
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {recentlyViewed.length > 0 ? (
        <Box>
          <Box display="flex" alignItems="center">
            <Typography
              variant="h2"
              sx={{
                marginTop: "40px",
              }}
            >
              Recently viewed
            </Typography>
          </Box>
          <CardContainer>
            {recentlyViewed.map((product, index) => (
              <Card
                product={product}
                key={index}
                overlayAction="cardButtonAddToCart"
              />
            ))}
          </CardContainer>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{
                marginTop: "40px",
                fontSize: { xs: 16, md: 30 },
              }}
            >
              No recently viewed products
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: 12, md: 20 },
              }}
            >
              You haven't viewed any products yet.
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
}
