"use client";
import CardContainer from "@/components/cards/CardContainer";
import { Header } from "@/components/Header";
import { Box } from "@mui/material";
import { useWishlistStore } from "@/store/wishlist";
import AuthenticatedSidebar from "@/components/AuthenticatedSidebar";

export default function MyWishlist() {
  const wishList = useWishlistStore((state) => state.wishList);

  return (
    <div>
      <Header isAuthenticated />
      <Box
        sx={{
          display: {
            xs: "none",
            sm: "none",
            md: "block",
          },
          marginTop: {
            xs: "60px",
            sm: "90px",
            md: "120px",
          },
        }}
      >
        <AuthenticatedSidebar />
      </Box>
      <Box
        sx={{
          marginTop: {
            xs: "60px",
            sm: "90px",
            md: "120px",
          },
        }}
      >
        <CardContainer products={wishList} topAction="cardButtonWishList" />
      </Box>
    </div>
  );
}
