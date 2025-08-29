"use client";

import { Box, Typography } from "@mui/material";
import { Session } from "next-auth";
import { ProductFormFields } from "../add-product/components/ProductFormFields";
import ImagePreviewerUploader from "../add-product/components/ImagePreviewerUploader";
import { urlToFile } from "@/lib/url-utils";
import { useProductForm } from "../hooks/useProductForm";
import { useImagePreviews } from "../hooks/useImagePreviews";
import { useCreateProduct } from "../add-product/hooks/useCreateProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { ProductFormData } from "../add-product/types";
import { MyProduct } from "@/types/product";
import { useToastStore } from "@/store/toastStore";

interface EditProductFormProps {
  session: Session;
  brandOptions: { value: number; label: string }[];
  colorOptions: { value: number; label: string }[];
  sizeOptions: { value: number; label: number }[];
  categoryOptions: { value: number; label: string }[];
  product: MyProduct;
  mode: "edit" | "duplicate";
  onSuccess: () => void;
}

/**
 * EditProductForm
 *
 * A form component that can either edit an existing product or duplicate it into a new product.
 * It wires together the product form fields, an image preview/upload widget, and React Query mutations to create or update products.
 *
 * @param {EditProductFormProps} props - Component props.
 * @returns {JSX.Element} The editable product form UI.
 *
 * @remarks
 * - When duplicating a product (`mode === 'duplicate'`) the component attempts to convert any kept existing image URLs into `File` objects via `urlToFile` so they can be uploaded for the new product.
 * - When editing, it computes which existing images were removed and which remain and instructs the update mutation to delete removed images after successfully updating the product.
 */

export const EditProductForm: React.FC<EditProductFormProps> = ({
  session,
  brandOptions,
  colorOptions,
  sizeOptions,
  categoryOptions,
  product,
  mode,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    errors,
    selectedSizes,
    toggleSize,
  } = useProductForm({
    name: product.name,
    color: product.color.id,
    gender: product.gender.id,
    brand: product.brand.id,
    price: product.price,
    categories: product.categories?.[0]?.id,
    description: product.description,
    sizes: product?.sizes?.map((s) => s.id),
    userID: 0,
  });

  const initialUrls = product.images ? product.images.map((i) => i.url) : [];
  const previews = useImagePreviews(initialUrls);

  const { mutateAsync: handleCreateProduct } = useCreateProduct(session);
  const { mutateAsync: handleUpdateProduct } = useUpdateProduct(session);

  /**
   * Submit handler used for both edit and duplicate flows.
   * It gathers the user ID, determines which existing images to keep/delete, and delegates to the appropriate mutation hook.
   *
   * @param {ProductFormData} data - The validated form payload from react-hook-form.
   */
  const onSubmit = async (data: ProductFormData) => {
    const userID = parseInt(session?.user.id ?? "0", 10);

    const remainingExistentImageIds = product.images
      ? product.images
          .filter((img) => previews.getRemainingUrls().includes(img.url))
          .map((img) => img.id)
      : [];

    const imagesToDelete =
      product.images && product.images.length
        ? product.images
            .map((img) => img.id)
            .filter((id) => !remainingExistentImageIds.includes(id))
        : [];

    if (mode === "edit") {
      try {
        await handleUpdateProduct({
          productId: product.id,
          data: { ...data, userID },
          imageFiles: previews.getNewFiles(),
          existentImages: remainingExistentImageIds,
          imagesToDelete,
        });
        onSuccess?.();
      } catch {
        useToastStore.getState().show({
          severity: "error",
          message: "Failed to update product",
        });
      }
    } else {
      try {
        let filesToUpload: File[] = [...previews.getNewFiles()];

        if (product.images?.length) {
          const imagesToKeep = product.images.filter((img) =>
            previews.getRemainingUrls().includes(img.url)
          );
          if (imagesToKeep.length) {
            const duplicatedFiles = await Promise.all(
              imagesToKeep.map((img) => urlToFile(img.url))
            );
            filesToUpload = [...filesToUpload, ...duplicatedFiles];
          }
        }

        await handleCreateProduct({
          data: { ...data, userID },
          imageFiles: filesToUpload,
          remainingExistentImages: [],
        });

        onSuccess?.();
      } catch {
        useToastStore.getState().show({
          severity: "error",
          message: "Failed to duplicate product",
        });
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
          maxWidth: { md: "426px" },
          width: { md: "50%", sm: "100%" },
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
          setError={setError}
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
          session={session}
          onFilesChange={previews.setImageFiles}
          initialPreviews={previews.getRemainingUrls()}
          onPreviewsChange={previews.setExistentImages}
          reset={
            previews.getNewFiles().length === 0 &&
            previews.getRemainingUrls().length === 0
          }
        />
      </Box>
    </Box>
  );
};
