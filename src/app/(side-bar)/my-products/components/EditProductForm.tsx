"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { ProductFormData, productSchema } from "../add-product/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormFields } from "../add-product/components/ProductFormFields";
import { Box, Typography } from "@mui/material";
import ImagePreviewerUploader from "../add-product/components/ImagePreviewerUploader";
import { MyProduct } from "@/types/product";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useCreateProduct } from "../add-product/hooks/useCreateProduct";
import { urlToFile } from "@/lib/url-utils";
import Toast from "@/components/Toast";

/**
 * Props for the EditProductForm component.
 *
 * @interface EditProductFormProps
 * @property {{ value: number, label: string }[]} brandOptions - Options for the Brand select input.
 * @property {{ value: number, label: string }[]} colorOptions - Options for the Color select input.
 * @property {{ value: number, label: number }[]} sizeOptions - Options for the Sizes selection.
 * @property {MyProduct} product  - The details of an existent product.
 * @property {String} mode  - Defines if we are going to delete or duplicate a product.
 * @property {()=> void} onSuccess  - onSuccess action.
 * @property {(msg:string , sev: "success" | "error")=>} onNotify  - onNotify action.
 */

interface EditProductFormProps {
  brandOptions: { value: number; label: string }[];
  colorOptions: { value: number; label: string }[];
  sizeOptions: { value: number; label: number }[];
  categoryOptions: { value: number; label: string }[];
  product: MyProduct;
  mode: "edit" | "duplicate";
  onSuccess: () => void;
  onNotify: (message: string, sev: "success" | "error") => void;
}

/**
 * A form component for editing or duplicating an existing product.
 *
 * - Uses `react-hook-form` with a Zod schema resolver for validation.
 * - Handles both "edit" (update existing product) and "duplicate" (create new product) modes.
 * - Provides image management (upload, delete).
 * - Displays success/error feedback via Toast component.
 *
 * @component
 * @param {EditProductFormProps} props - Props for configuring the form.
 * @returns {JSX.Element} The rendered product form UI.
 *
 * @example
 * <EditProductForm
 *   brandOptions={[{ value: 1, label: "Nike" }]}
 *   colorOptions={[{ value: 1, label: "Red" }]}
 *   sizeOptions={[{ value: 42, label: 42 }]}
 *   product={myProduct}
 *   mode="edit"
 *   onSuccess={() => console.log("Updated!")}
 *   onNotify={handleNotify}
 * />
 */

export const EditProductForm: React.FC<EditProductFormProps> = ({
  brandOptions,
  colorOptions,
  sizeOptions,
  categoryOptions,
  product,
  mode,
  onSuccess,
  onNotify,
}) => {
  const { data: session } = useSession();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existentImages, setExistentImages] = useState<string[]>(
    product.images ? product.images.map((image) => image.url) : []
  );
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
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
      categories: product.categories[0].id,
      description: product.description,
      sizes: product?.sizes?.map((size) => size.id),
      userID: 0,
    },
  });

  const { mutateAsync: handleUpdateProduct } = useUpdateProduct(product.id);
  const { mutateAsync: handleCreateProduct } = useCreateProduct();

  const selectedSizes = watch("sizes");

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
      ? product.images
          .filter((image) => existentImages.includes(image.url))
          .map((image) => image.id)
      : [];

    const imagesToDelete =
      product.images &&
      product.images
        .map((img) => img.id)
        .filter((id) => !remainingExistentImages.includes(id));

    if (mode === "edit") {
      try {
        await handleUpdateProduct({
          data: { ...data, userID },
          imageFiles,
          existentImages: remainingExistentImages,
          imagesToDelete,
        });
        onNotify("Product updated successfully!", "success");
        onSuccess?.();
      } catch {
        onNotify("Failed to update product.", "error");
      }
    } else {
      try {
        let filesToUpload: File[] = [...imageFiles];
        if (product.images?.length) {
          const duplicatedFiles = await Promise.all(
            product.images.map((img) => urlToFile(img.url))
          );
          filesToUpload = [...filesToUpload, ...duplicatedFiles];
        }

        await handleCreateProduct({
          data: { ...data, userID },
          imageFiles: filesToUpload,
        });
        onNotify("Product added successfully!", "success");
        onSuccess();
      } catch {
        onNotify("Failed to add product.", "error");
      }
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
          categoryOptions={categoryOptions}
          selectedSizes={selectedSizes}
          toggleSize={toggleSize}
          getValues={getValues}
          setValue={setValue}
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
          initialPreviews={
            product.images ? product.images.map((image) => image.url) : []
          }
          onPreviewsChange={setExistentImages}
        />
      </Box>
    </Box>
  );
};
