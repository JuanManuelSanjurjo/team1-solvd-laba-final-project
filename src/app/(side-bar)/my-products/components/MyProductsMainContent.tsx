"use client";
import { useState } from "react";
import { Box } from "@mui/material";
import MyProductsEmptyState from "@/components/MyProductsEmptyState";
import MyProductsHeader from "./MyProductsHeader";
import { fetchUserProducts } from "@/lib/strapi/fetchUserProducts";
import { MyProduct, Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import CardContainer from "@/components/cards/CardContainer";
import Card from "@/components/cards/Card";
import SkeletonCardContainer from "@/app/products/components/SkeletonCardContainer";
import {
  normalizeMyProductCard,
  normalizeProductCard,
} from "@/lib/normalizers/normalizeProductCard";

/**
 * MyProductsMainContent
 *
 * This component renders the main content of the My Products page.
 * It includes a header, a list of products, and an empty state.
 *
 * @component
 *
 * @returns {JSX.Element} The main content of the My Products page.
 */

export default function MyProductsMainContent() {
  const { data: session, status } = useSession();

  const userId = session?.user?.id;
  const token = session?.user?.jwt;

  const { data, isLoading, isError } = useQuery<MyProduct[], Error>({
    queryKey: ["user-products", userId],
    queryFn: () => {
      if (!userId || !token) throw new Error("User not authenticated");
      return fetchUserProducts(parseInt(userId), token);
    },
    enabled: !!userId && !!token,
  });

  const products = data ?? [];
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "50vh",
        marginInline: { xs: "20px", lg: 0 },
      }}
    >
      <MyProductsHeader isEmpty={products ? products.length === 0 : false} />
      {isLoading ? (
        <SkeletonCardContainer />
      ) : products.length > 0 ? (
        <CardContainer>
          {normalizeMyProductCard(products).map((product, index) => (
            <Card
              product={product}
              topAction="cardButtonWishList"
              overlayAction="cardOverlayAddToCard"
              key={index}
              overlay={true}
            />
          ))}
        </CardContainer>
      ) : (
        <MyProductsEmptyState
          title="You don't have any products yet"
          subtitle="Post can contain video, images and text"
          buttonText="Add Product"
          onClick={() => console.log("Add Product")}
        />
      )}
    </Box>
  );
}
