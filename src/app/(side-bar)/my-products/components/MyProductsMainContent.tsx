"use client";
import { useMemo, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
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
import { useRouter, useSearchParams } from "next/navigation";
import { Session } from "next-auth";
import PaginationComponent from "@/components/PaginationComponent";
import useQueryUserProductsPaged from "../hooks/useQueryUserProductsPaged";
import useSearchMyProducts from "../hooks/useSearchMyProducts";
import { SearchBar } from "@/components/SearchBar";
import { Add } from "iconsax-react";

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
  const searchParams = useSearchParams();
  const searchTerm = useMemo(
    () => searchParams.get("searchTerm"),
    [searchParams]
  );

  const userId = session?.user?.id;
  const token = session?.user?.jwt;

  const [selectedProduct, setSelectedProduct] = useState<MyProduct | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"edit" | "duplicate">("edit");

  const {
    searchInput,
    handleSearchInputChange,
    handleSearchSubmit,
    deleteSearchTerm,
  } = useSearchMyProducts();

  const pageSize = 16;
  const page = Number(searchParams.get("page") ?? 1);

  function handleSetPage(page: number) {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    router.push(`?${newSearchParams.toString()}`);
  }

  const { products, pagination, isPending, isLoading } =
    useQueryUserProductsPaged({
      userId,
      token,
      pageNumber: page,
      pageSize,
      searchQuery: searchTerm ?? "",
    });

  const deleteMutation = useDeleteProduct({
    session,
    setPage: handleSetPage,
    currentPage: page,
    productsLength: products.length,
  });

  const handleDeleteProduct = (productId: number, imageIds: number[] = []) => {
    deleteMutation.mutate({ productId, imageIds });
  };

  const isMdUp = useMediaQuery(useTheme().breakpoints.up("lg"), {
    noSsr: true,
  });

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
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "flex-start", lg: "space-between" },
          gap: "30px",
          alignItems: "center",
          flexDirection: { xs: "column", lg: "row" },
          marginTop: "30px",
          marginBottom: "20px",
        }}
      >
        <SearchBar
          size="medium"
          placeholder="Search your products"
          onChange={handleSearchInputChange}
          onSubmit={handleSearchSubmit}
          fullWidth={isMdUp ? false : true}
          value={searchInput}
        />
        {searchTerm && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                typography: {
                  xs: "h4",
                  md: "h3",
                },
              }}
              color="text.primary"
            >
              Search results for
            </Typography>
            <Box
              sx={{
                backgroundColor: "rgba(150,150,150,0.1)",
                borderRadius: 1,
                display: "flex",
                gap: 1,
                alignItems: "center",
                maxWidth: "100%",
              }}
            >
              <Typography
                title={searchTerm}
                sx={{
                  typography: {
                    xs: "h4",
                    md: "h3",
                  },
                  paddingInline: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {searchTerm}
              </Typography>
              <Add
                color="rgba(92, 92, 92, 1)"
                size={24}
                style={{ transform: "rotate(45deg)", cursor: "pointer" }}
                onClick={deleteSearchTerm}
              />
            </Box>
          </Box>
        )}
      </Box>

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

          {pagination ? (
            <Box
              sx={{ marginTop: 4, display: "flex", justifyContent: "center" }}
            >
              <PaginationComponent
                pagination={pagination}
                setPage={handleSetPage}
              />
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
