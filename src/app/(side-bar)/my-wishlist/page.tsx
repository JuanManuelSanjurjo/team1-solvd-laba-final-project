"use client";
import CardContainer from "@/components/cards/CardContainer";
import Card from "@/components/cards/Card";
import { Box, Typography } from "@mui/material";
import { useWishlistStore } from "@/store/wishlist";

export default function MyWishlist() {
  const wishList = useWishlistStore((state) => state.wishList);

  return (
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
          <Card product={product} key={index} topAction="cardButtonWishList" />
        ))}
      </CardContainer>
    </Box>
  );
}
