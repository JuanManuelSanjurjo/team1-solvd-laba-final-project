"use client";
import ShoeSizeOption from "@/app/products/[product-id]/components/ShoeSizeOption";
import Input from "@/components/FormElements/Input";
import Select from "@/components/FormElements/Select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  FormHelperText,
  Snackbar,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import ImagePreviewerUploader from "./ImagePreviewerUploader";
import { useState } from "react";
import { ProductFormData, productSchema } from "../schema";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { Danger } from "iconsax-react";

/**
 * Props for AddProductForm component.
 *
 * @typedef AddProductFormProps
 * @property {Array<{ value: number; label: string }>} brandOptions - Options for the Brand select input.
 * @property {Array<{ value: number; label: string }>} colorOptions - Options for the Color select input.
 * @property {Array<{ value: number; label: number }>} sizeOptions - Options for the Sizes selection.
 */
interface AddProductFormProps {
  brandOptions: { value: number; label: string }[];
  colorOptions: { value: number; label: string }[];
  sizeOptions: { value: number; label: number }[];
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
}) => {
  const { data: session } = useSession();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
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
      name: "",
      color: colorOptions[0].value,
      gender: 4,
      brand: brandOptions[0].value,
      price: 0,
      description: "",
      sizes: [],
      userId: 0,
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
    const userId = parseInt(session?.user.id ?? "0", 10);
    try {
      await handleCreateProduct({ data: { ...data, userId }, imageFiles });
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
        <Input
          {...register("name")}
          label="Product name"
          name="name"
          required
          errorMessage={errors.name?.message ?? ""}
        />

        <Input
          {...register("price", { valueAsNumber: true })}
          label="Price"
          name="price"
          type="number"
          required
          errorMessage={errors.price?.message ?? ""}
        />

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Color"
              name="color"
              options={colorOptions}
              placeholder=""
              required
            />
          )}
        />
        <Box sx={{ display: "flex", gap: "16px" }}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Gender"
                name="gender"
                options={[
                  { label: "Women", value: 4 },
                  { label: "Man", value: 3 },
                ]}
                placeholder=""
              />
            )}
          />
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Brand"
                name="brand"
                options={brandOptions}
                placeholder=""
              />
            )}
          />
        </Box>
        <Input
          {...register("description")}
          label="Description"
          name="description"
          required
          errorMessage={errors.description?.message ?? ""}
          multiline
          fullWidth
          sx={{ height: "320px", alignItems: "flex-start" }}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, 82px)",
            justifyContent: "space-around",
            alignItems: "center",
            gap: {
              xs: 1,
              md: 3,
            },
          }}
        >
          {sizeOptions.map((size) => (
            <ShoeSizeOption
              key={size.value}
              value={size.value}
              size={size.label}
              disabled={false}
              checked={selectedSizes.includes(size.value)}
              onToggle={toggleSize}
            />
          ))}
        </Box>
        {errors.sizes?.message && (
          <FormHelperText sx={{ color: "#FE645E" }}>
            <Danger color="#FE645E" size="16" style={{ marginRight: "6px" }} />
            {errors.sizes?.message}
          </FormHelperText>
        )}
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
        <ImagePreviewerUploader onFilesChange={setImageFiles} />
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
