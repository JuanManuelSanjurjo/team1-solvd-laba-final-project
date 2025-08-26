"use client";

import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { Session } from "next-auth";
import { ProductFormFields } from "./ProductFormFields";
import ImagePreviewerUploader from "./ImagePreviewerUploader";

import { useToastStore } from "@/store/toastStore";
import { useProductForm } from "../../hooks/useProductForm";
import { useImagePreviews } from "../../hooks/useImagePreviews";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { ProductFormData } from "../types";

interface AddProductFormProps {
  session: Session;
  brandOptions: { value: number; label: string }[];
  colorOptions: { value: number; label: string }[];
  sizeOptions: { value: number; label: number }[];
  categoryOptions: { value: number; label: string }[];
}

export const AddProductForm: React.FC<AddProductFormProps> = ({
  session,
  brandOptions,
  colorOptions,
  sizeOptions,
  categoryOptions,
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    reset,
    errors,
    selectedSizes,
    toggleSize,
  } = useProductForm({
    color: colorOptions[0]?.value,
    gender: 4,
    brand: brandOptions[0]?.value,
    categories: categoryOptions[0]?.value,
  });

  const previews = useImagePreviews([]);
  const { mutateAsync: handleCreateProduct } = useCreateProduct(session);

  const onSubmit = async (data: ProductFormData) => {
    const userID = parseInt(session?.user.id ?? "0", 10);
    try {
      await handleCreateProduct({
        data: { ...data, userID },
        imageFiles: previews.getNewFiles(),
        remainingExistentImages: [],
      });

      reset({
        name: "",
        color: colorOptions[0].value,
        gender: 4,
        brand: brandOptions[0].value,
        price: 0,
        description: "",
        sizes: [],
        userID: 0,
      });

      previews.reset();
      router.push("/my-products");
    } catch (e) {
      useToastStore.getState().show({
        severity: "error",
        message: "Failed to add product",
      });
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
        id="add-product-form"
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
          selectedSizes={selectedSizes}
          categoryOptions={categoryOptions}
          toggleSize={toggleSize}
          setValue={setValue}
          getValues={getValues}
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
