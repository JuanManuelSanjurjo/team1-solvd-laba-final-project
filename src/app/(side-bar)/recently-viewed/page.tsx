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
          <MyProductsEmptyState
            title="You haven't viewed any products yet"
            subtitle="View available products in the products page."
            buttonText="Go to products"
            onClick={visitProducts}
            icon={LogoBlackSvg}
          ></MyProductsEmptyState>
        )}
      </Box>
    </>
  );
}
