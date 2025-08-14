"use client";
import CardContainer from "@/components/cards/CardContainer";
import Card from "@/components/cards/Card";
import { Box, Typography } from "@mui/material";
import { useWishlistStore } from "@/store/wishlist";
import { useState, useEffect } from "react";
import MyProductsEmptyState from "@/components/MyProductsEmptyState";
import { useRouter } from "next/navigation";
import { LogoBlackSvg } from "@/components/LogoBlackSvg";
import { useSession } from "next-auth/react";

export default function MyWishlist() {
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const byUser = useWishlistStore((state) => state.byUser);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated || status === "loading") {
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

  const userId = String(session!.user!.id);
  const wishList = byUser[userId] ?? [];

  function visitProducts() {
    router.push("/products");
  }

  return (
    <>
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
        {wishList.length > 0 ? (
          <CardContainer>
            {wishList.map((product, index) => (
              <Card
                product={product}
                key={index}
                topAction="cardButtonWishList"
              />
            ))}
          </CardContainer>
        ) : (
          <MyProductsEmptyState
            title="You don't have any products in wishlist yet"
            subtitle="Add products from products page using the heart icon."
            buttonText="Go to products"
            onClick={visitProducts}
            icon={LogoBlackSvg}
          ></MyProductsEmptyState>
        )}
      </Box>
    </>
  );
}
