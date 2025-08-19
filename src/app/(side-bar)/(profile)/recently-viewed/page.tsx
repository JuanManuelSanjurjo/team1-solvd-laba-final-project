"use client";
import Card from "@/components/cards/Card";
import CardContainer from "@/components/cards/CardContainer";
import { useRecentlyViewedStore } from "@/store/recentlyviewed";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import MyProductsEmptyState from "@/components/MyProductsEmptyState";
import { useRouter } from "next/navigation";
import { LogoBlackSvg } from "@/components/LogoBlackSvg";
import { useSession } from "next-auth/react";
import ProfileHeaderTitle from "../components/ProfileHeaderTitle";

export default function RecentlyViewed() {
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const byUser = useRecentlyViewedStore((state) => state.byUser);

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
  const recentlyViewed = byUser[userId] ?? [];

  function visitProducts() {
    router.push("/products");
  }

  return (
    <>
      <ProfileHeaderTitle>Recently Viewed</ProfileHeaderTitle>
      {recentlyViewed.length > 0 ? (
        <CardContainer>
          {recentlyViewed.map((product, index) => (
            <Card
              product={product}
              key={index}
              overlayAction="cardButtonAddToCart"
            />
          ))}
        </CardContainer>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <MyProductsEmptyState
            title="You haven't viewed any products yet"
            subtitle="View available products in the products page."
            buttonText="Go to products"
            onClick={visitProducts}
            icon={LogoBlackSvg}
          />
        </Box>
      )}
    </>
  );
}
