"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import ImagePreviewerUploader from "./ImagePreviewerUploader";
import { useState } from "react";
import { ProductFormData, productSchema } from "../schema";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { ProductFormFields } from "./ProductFormFields";

/**
 * Props for AddProductForm component.
 *
 * @typedef AddProductFormProps
 * @property {Array<{ value: number; label: string }>} brandOptions - Options for the Brand select input.
 * @property {Array<{ value: number; label: string }>} colorOptions - Options for the Color select input.
 * @property {Array<{ value: number; label: number }>} sizeOptions - Options for the Sizes selection.
 * @property {Array<{ value: number; label: number }>} categoryOptions - Options for the Sizes selection.

 */

interface AddProductFormProps {
  brandOptions: { value: number; label: string }[];
  colorOptions: { value: number; label: string }[];
  sizeOptions: { value: number; label: number }[];
  categoryOptions: { value: number; label: string }[];
}

/**
 * Form component to add a new product.
 *
 * Handles user inputs including product details, sizes, images, and submits the data.
 * Shows success/error notifications.
 *
 * @param {AddProductFormProps} props - Props containing options for brand, color, and size inputs.
 * @returns {JSX.Element} The rendered AddProductForm component.
 */

export const AddProductForm: React.FC<AddProductFormProps> = ({
  brandOptions,
  colorOptions,
  sizeOptions,
  categoryOptions,
}) => {
  const { data: session } = useSession();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      color: colorOptions[0].value,
      gender: 4,
      brand: brandOptions[0].value,
      category: categoryOptions[0].value,
      price: 0,
      description: "",
      sizes: [],
      userID: 0,
    },
  });
  const selectedSizes = watch("sizes");

  const { mutateAsync: handleCreateProduct } = useCreateProduct();

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
    try {
      await handleCreateProduct({ data: { ...data, userID }, imageFiles });

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

      setImageFiles([]);

      setSnackbarMessage("Product added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.log(err);
      setSnackbarMessage("Failed to add product.");
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
        id="add-product-form"
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
          categoryOptions={categoryOptions}
          toggleSize={toggleSize}
          setValue={setValue}
          getValues={getValues}
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
          reset={imageFiles.length === 0}
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
