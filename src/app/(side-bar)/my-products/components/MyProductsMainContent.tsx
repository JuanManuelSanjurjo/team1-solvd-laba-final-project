"use client";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import ProductsEmptyState from "@/components/ProductsEmptyState";
import MyProductsHeader from "./MyProductsHeader";
import { MyProduct } from "@/types/product";
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
import { Session } from "next-auth";
import PaginationComponent from "@/components/PaginationComponent";
import useQueryUserProductsPaged from "../hooks/useQueryUserProductsPaged";

interface MyProductsMainContentProps {
  session: Session;
  brandOptions: { value: number; label: string }[];
  colorOptions: { value: number; label: string }[];
  sizeOptions: { value: number; label: number }[];
  categoryOptions: { value: number; label: string }[];
}

export default function MyProductsMainContent({
  session,
  brandOptions,
  colorOptions,
  sizeOptions,
  categoryOptions,
}: MyProductsMainContentProps) {
  const router = useRouter();

  const userId = session?.user?.id;
  const token = session?.user?.jwt;

  const [selectedProduct, setSelectedProduct] = useState<MyProduct | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"edit" | "duplicate">("edit");

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(16);

  const { products, pagination, isPending, isLoading } =
    useQueryUserProductsPaged({
      userId,
      token,
      pageNumber: page,
      pageSize,
    });

  const handleSetPage = () => {
    setPage(0);
  };

  const deleteMutation = useDeleteProduct({
    session,
    setPage,
    currentPage: page,
    productsLength: products.length,
  });

  const handleDeleteProduct = (productId: number, imageIds: number[] = []) => {
    deleteMutation.mutate({ productId, imageIds });
  };

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

      {isPending || isLoading ? (
        <SkeletonCardContainer />
      ) : products && products.length > 0 ? (
        <>
          <CardContainer length={products.length}>
            {normalizeMyProductCard(products).map((product, index) => (
              <Card
                session={session}
                product={product}
                topAction="cardButtonMenu"
                key={product.id ?? index}
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

          {/* pagination */}
          {pagination ? (
            <Box
              sx={{ marginTop: 4, display: "flex", justifyContent: "center" }}
            >
              <PaginationComponent pagination={pagination} setPage={setPage} />
            </Box>
          ) : null}
        </>
      ) : (
        <ProductsEmptyState
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
