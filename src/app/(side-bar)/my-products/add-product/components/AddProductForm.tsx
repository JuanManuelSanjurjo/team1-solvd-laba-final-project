"use client";
import ShoeSizeOption from "@/app/products/[product-id]/components/ShoeSizeOption";
import Button from "@/components/Button";
import Input from "@/components/FormElements/Input";
import Select from "@/components/FormElements/Select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      color: 0,
      gender: 0,
      brand: 0,
      price: 0,
      description: "",
    },
  });

  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);

  const toggleSize = (size: number) => {
    const updatedSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];

    setSelectedSizes(updatedSizes);
    // setValue("sizes", updatedSizes, { shouldValidate: true });
  };

  const onSubmit = (data: ProductFormData) => {
    console.log("Form submitted", data);
    // You can now send `data` to your backend or API
  };

  return (
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
        errorMessage={""}
      />

      <Input
        {...register("price", { valueAsNumber: true })}
        label="Price"
        name="price"
        type="number"
        required
        errorMessage=""
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
        errorMessage={""}
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
          <ShoeSizeOption key={size.value} size={size.label} disabled={false} />
        ))}
      </Box>
      <Button type="submit">Save changes</Button>
    </Box>
  );
};
