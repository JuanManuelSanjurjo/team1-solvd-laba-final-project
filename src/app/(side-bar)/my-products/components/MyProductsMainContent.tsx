"use client";
import { useState } from "react";
import { Box } from "@mui/material";
import MyProductsEmptyState from "@/components/MyProductsEmptyState";
import MyProductsHeader from "./MyProductsHeader";
import { fetchUserProducts } from "@/lib/strapi/fetch-user-products";
import { MyProduct } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import CardContainer from "@/components/cards/CardContainer";
import Card from "@/components/cards/Card";
import SkeletonCardContainer from "@/components/skeletons/products/SkeletonCardContainer";
import { normalizeMyProductCard } from "@/lib/normalizers/normalize-product-card";
import { EditProductModalWrapper } from "./EditProductModalWrapper";
import Button from "@/components/Button";
import { EditProductForm } from "./EditProductForm";
import { EditProductHeader } from "@/app/(side-bar)/my-products/components/EditProductHeader";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useRouter } from "next/navigation";

interface MyProductsMainContentProps {
  brandOptions: { value: number; label: string }[];
  colorOptions: { value: number; label: string }[];
  sizeOptions: { value: number; label: number }[];
  categoryOptions: { value: number; label: string }[];
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
  categoryOptions,
}: MyProductsMainContentProps) {
  const deleteMutation = useDeleteProduct();
  const router = useRouter();

  const handleDeleteProduct = (productId: number, imageIds: number[] = []) => {
    deleteMutation.mutate({ productId, imageIds });
  };

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const token = session?.user?.jwt;

  const [selectedProduct, setSelectedProduct] = useState<MyProduct | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"edit" | "duplicate">("edit");

  const { data, isPending } = useQuery<MyProduct[], Error>({
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
      {isPending ? (
        <SkeletonCardContainer />
      ) : products.length > 0 ? (
        <CardContainer length={products.length}>
          {normalizeMyProductCard(products).map((product, index) => (
            <Card
              product={product}
              topAction="cardButtonMenu"
              key={index}
              overlay={true}
              onEdit={() => {
                setSelectedProduct(products[index]);
                setFormMode("edit");
                setEditModalOpen(true);
              }}
              onDuplicate={() => {
                setSelectedProduct(products[index]);
                setFormMode("duplicate");
                setEditModalOpen(true);
              }}
              onDelete={() => {
                handleDeleteProduct(
                  product.id,
                  products[index].images
                    ? products[index].images.map((image) => image.id)
                    : []
                );
              }}
            />
          ))}
        </CardContainer>
      ) : (
        <MyProductsEmptyState
          title="You don't have any products yet"
          subtitle="Post can contain video, images and text"
          buttonText="Add Product"
          onClick={() => router.push("/my-products/add-product")}
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
            title={formMode === "edit" ? "Edit Product" : "Add Product"}
          />

          <EditProductForm
            sizeOptions={sizeOptions}
            colorOptions={colorOptions}
            brandOptions={brandOptions}
            categoryOptions={categoryOptions}
            product={selectedProduct ?? products[0]}
            mode={formMode}
            onSuccess={() => setEditModalOpen(false)}
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
