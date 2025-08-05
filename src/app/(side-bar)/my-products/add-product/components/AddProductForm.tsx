"use client";
import ShoeSizeOption from "@/app/products/[product-id]/components/ShoeSizeOption";
import Button from "@/components/Button";
import Input from "@/components/FormElements/Input";
import Select from "@/components/FormElements/Select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import ImagePreviewerUploader from "./ImagePreviewerUploader";
import { useState } from "react";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  color: z.number().refine((val) => typeof val === "number", {
    message: "Color is required",
  }),
  gender: z.number().refine((val) => typeof val === "number", {
    message: "Gender is required",
  }),
  brand: z.number().refine((val) => typeof val === "number", {
    message: "Brand is required",
  }),
  description: z.string().min(1, "Description is required"),
  price: z
    .number()
    .refine((val) => typeof val === "number", {
      message: "Brand is required",
    })
    .positive("Price must be greater than 0"),
  sizes: z.array(z.number()).min(1, "At least one size must be selected"),
  userId: z.number().refine((val) => typeof val === "number", {
    message: "Brand is required",
  }),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductFormProps {
  brandOptions: [{ value: number; label: string }];
  colorOptions: [{ value: number; label: string }];
  sizeOptions: [{ value: number; label: number }];
}

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
      color: 8,
      gender: 4,
      brand: 9,
      price: 10,
      description: "",
      sizes: [],
      userId: 0,
    },
  });
  const selectedSizes = watch("sizes");

  const toggleSize = (size: number) => {
    const currentSizes = selectedSizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    setValue("sizes", newSizes);
  };

  const onSubmit = (data: ProductFormData) => {
    (data.userId = parseInt(session?.user.id ?? "0", 10)),
      console.log("Form submitted", data);
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
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {sizeOptions.map((size) => (
            <ShoeSizeOption
              key={size.value}
              size={size.label}
              disabled={false}
              checked={selectedSizes.includes(size.value)}
              onToggle={toggleSize}
            />
          ))}
        </Box>
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
        <Button type="submit">Save changes</Button>
      </Box>
    </Box>
  );
};
