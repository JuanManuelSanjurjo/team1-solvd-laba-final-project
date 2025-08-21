"use client";
import { useState } from "react";
import { Box } from "@mui/material";
import MyProductsEmptyState from "@/components/MyProductsEmptyState";
import MyProductsHeader from "./MyProductsHeader";
import { fetchUserProducts } from "@/lib/strapi/fetch-user-products";
import { MyProduct } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
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
import Toast from "@/components/Toast";
import { Session } from "next-auth";

interface MyProductsMainContentProps {
  session: Session;
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
  session,
  brandOptions,
  colorOptions,
  sizeOptions,
  categoryOptions,
}: MyProductsMainContentProps) {
  const deleteMutation = useDeleteProduct(session);
  const router = useRouter();

  const handleDeleteProduct = (productId: number, imageIds: number[] = []) => {
    deleteMutation.mutate({ productId, imageIds });
  };

  const userId = session?.user?.id;
  const token = session?.user?.jwt;

  const [selectedProduct, setSelectedProduct] = useState<MyProduct | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"edit" | "duplicate">("edit");

  const [toastOpen, setToastOpen] = useState(false);
  const [toastContent, setToastContent] = useState<{
    message: string;
    severity: "success" | "error";
  }>({
    message: "",
    severity: "success",
  });

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const handleNotify = (message: string, severity: "success" | "error") => {
    setToastContent({ message, severity });
    setToastOpen(true);
  };

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
              session={session}
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
            session={session}
            sizeOptions={sizeOptions}
            colorOptions={colorOptions}
            brandOptions={brandOptions}
            categoryOptions={categoryOptions}
            product={selectedProduct ?? products[0]}
            mode={formMode}
            onSuccess={() => setEditModalOpen(false)}
            onNotify={handleNotify}
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
      <Toast
        open={toastOpen}
        onClose={handleCloseToast}
        severity={toastContent.severity}
        message={toastContent.message}
        autoHideDuration={4000}
      />
    </Box>
  );
}
