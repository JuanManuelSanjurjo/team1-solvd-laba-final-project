"use client";
import CardContainer from "@/components/cards/CardContainer";
import Card from "@/components/cards/Card";
import { Box, Typography } from "@mui/material";
import { useWishlistStore } from "@/store/wishlist";
import { useState, useEffect } from "react";

export default function MyWishlist() {
  const [isHydrated, setIsHydrated] = useState(false);
  const wishList = useWishlistStore((state) => state.wishList);

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
      {wishList.length > 0 ? (
        <Box
          sx={{
            marginInline: { xs: "20px", lg: 0 },
            textAlign: "left",
          }}
        >
          <Box display="flex" alignItems="center">
            <Typography
              variant="h2"
              sx={{
                marginTop: "40px",
              }}
            >
              My Wishlist
            </Typography>
          </Box>
          <CardContainer>
            {wishList.map((product, index) => (
              <Card
                product={product}
                key={index}
                topAction="cardButtonWishList"
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
              No saved products in your wishlist
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: 12, md: 20 },
              }}
            >
              You haven't saved any products yet.
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
}
