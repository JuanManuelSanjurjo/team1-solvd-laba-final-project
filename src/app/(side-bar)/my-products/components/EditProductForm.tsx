"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { ProductFormData, productSchema } from "../add-product/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormFields } from "../add-product/components/ProductFormFields";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import ImagePreviewerUploader from "../add-product/components/ImagePreviewerUploader";
import { MyProduct } from "@/types/product";
import { useUpdateProduct } from "../hooks/useUpdateProduct";

interface EditProductFormProps {
  brandOptions: { value: number; label: string }[];
  colorOptions: { value: number; label: string }[];
  sizeOptions: { value: number; label: number }[];
  product: MyProduct;
}

export const EditProductForm: React.FC<EditProductFormProps> = ({
  brandOptions,
  colorOptions,
  sizeOptions,
  product,
}) => {
  const { data: session } = useSession();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existentImages, setExistentImages] = useState<string[]>(
    product.images.map((image) => image.url)
  );
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      color: product.color.id,
      gender: product.gender.id,
      brand: product.brand.id,
      price: product.price,
      description: product.description,
      sizes: product?.sizes?.map((size) => size.id),
      userID: 0,
    },
  });

  const { mutateAsync: handleUpdateProduct } = useUpdateProduct(product.id);

  const selectedSizes = watch("sizes");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const toggleSize = (size: number) => {
    const currentSizes = selectedSizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    setValue("sizes", newSizes);
  };

  const onSubmit = async (data: ProductFormData) => {
    const userID = parseInt(session?.user.id ?? "0", 10);

    const remainingExistentImages = product.images
      .filter((image) => existentImages.includes(image.url))
      .map((image) => image.id);

    try {
      await handleUpdateProduct({
        data: { ...data, userID },
        imageFiles,
        existentImages: remainingExistentImages,
      });
      setSnackbarMessage("Product updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.log(err);
      setSnackbarMessage("Failed to update product.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "60px",
        flexDirection: { xs: "column", sm: "column", md: "row" },
      }}
    >
      <Box
        component="form"
        id="edit-product-form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: {
            md: "426px",
          },
          width: {
            md: "50%",
            sm: "100%",
          },
          gap: "24px",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <ProductFormFields
          register={register}
          control={control}
          errors={errors}
          colorOptions={colorOptions}
          brandOptions={brandOptions}
          sizeOptions={sizeOptions}
          selectedSizes={selectedSizes}
          toggleSize={toggleSize}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          component="label"
          variant="body2"
          color="#494949"
          sx={{ marginBottom: "8px" }}
        >
          Product images
        </Typography>
        <ImagePreviewerUploader
          onFilesChange={setImageFiles}
          initialPreviews={product.images.map((image) => image.url)}
          onPreviewsChange={setExistentImages}
        />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
