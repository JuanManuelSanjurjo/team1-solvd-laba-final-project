"use client";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import MyProductsEmptyState from "@/components/MyProductsEmptyState";
import MyProductsHeader from "./MyProductsHeader";
import { fetchUserProducts } from "@/lib/strapi/fetchUserProducts";
import { MyProduct } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import CardContainer from "@/components/cards/CardContainer";
import Card from "@/components/cards/Card";
import SkeletonCardContainer from "@/app/products/components/SkeletonCardContainer";
import { normalizeMyProductCard } from "@/lib/normalizers/normalizeProductCard";
import { EditProductModalWrapper } from "./EditProductModalWrapper";
import Button from "@/components/Button";
import { EditProductHeader } from "./EditProductHeader";
import { EditProductForm } from "./EditProductForm";

interface MyProductsMainContentProps {
  brandOptions: { value: number; label: string }[];
  colorOptions: { value: number; label: string }[];
  sizeOptions: { value: number; label: number }[];
}

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

export default function MyProductsMainContent({
  brandOptions,
  colorOptions,
  sizeOptions,
}: MyProductsMainContentProps) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const token = session?.user?.jwt;

  const [selectedProduct, setSelectedProduct] = useState<MyProduct | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);

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
              topAction="cardButtonMenu"
              key={index}
              overlay={true}
              onEdit={() => {
                setSelectedProduct(products[index]);
                setEditModalOpen(!editModalOpen);
              }}
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
      {editModalOpen && (
        <EditProductModalWrapper
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
        >
          <EditProductHeader
            onClose={() => {
              setEditModalOpen(false);
            }}
          />

          <EditProductForm
            sizeOptions={sizeOptions}
            colorOptions={colorOptions}
            brandOptions={brandOptions}
            product={selectedProduct ?? products[0]}
          />
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              sx={{
                position: { md: "absolute", sm: "static" },
                top: { md: "40px" },
                right: { md: "60px" },
                width: { md: "120px", sm: "60%", xs: "80%" },
              }}
              form="edit-product-form"
              type="submit"
            >
              Save
            </Button>
          </Box>
        </EditProductModalWrapper>
      )}
    </Box>
  );
}
