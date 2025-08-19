"use client";

import CardContainer from "@/components/cards/CardContainer";
import Card from "@/components/cards/Card";
import { Box } from "@mui/material";
import { useWishlistStore } from "@/store/wishlist";
import MyProductsEmptyState from "@/components/MyProductsEmptyState";
import { useRouter } from "next/navigation";
import { LogoBlackSvg } from "@/components/LogoBlackSvg";
import { Session } from "next-auth";
import { useCallback } from "react";
import ProfileHeaderTitle from "../../components/ProfileHeaderTitle";

export default function Wishlist({ session }: { session: Session }) {
  const router = useRouter();
  const byUser = useWishlistStore((state) => state.byUser);
  const userId = session.user.id;
  const wishList = byUser[userId] ?? [];

  const visitProducts = useCallback(() => {
    router.push("/products");
  }, [router]);

  return (
    <>
      <ProfileHeaderTitle>My wishlist</ProfileHeaderTitle>
      {wishList.length > 0 ? (
        <CardContainer length={wishList.length}>
          {wishList.map((product, index) => (
            <Card
              product={product}
              key={index}
              topAction="cardButtonWishList"
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
            title="You don't have any products in wishlist yet"
            subtitle="Add products from products page using the heart icon."
            buttonText="Go to products"
            onClick={visitProducts}
            icon={LogoBlackSvg}
          />
        </Box>
      )}
    </>
  );
}
