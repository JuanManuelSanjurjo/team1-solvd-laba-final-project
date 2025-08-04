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
  color: z.string().min(1, "Color is required"),
  gender: z.string().min(1, "Gender is required"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(1, "Description is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

export const AddProductForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      color: "",
      gender: "",
      brand: "",
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
      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            label="Color"
            name="color"
            options={[{ label: "Black", value: "black" }]}
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
              options={[
                { label: "Nike", value: 9 },
                { label: "Adidas", value: 10 },
                { label: "Asics", value: 11 },
                { label: "Puma", value: 12 },
                { label: "New Balance", value: 13 },
                { label: "Skechers", value: 14 },
                { label: "Lowa", value: 15 },
                { label: "Salomon", value: 16 },
                { label: "Reebok", value: 17 },
                { label: "UNder Armour", value: 18 },
              ]}
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
        {[36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48].map((size) => (
          <ShoeSizeOption key={size} size={size} disabled={false} />
        ))}
      </Box>
      <Button type="submit">Save changes</Button>
    </Box>
  );
};
