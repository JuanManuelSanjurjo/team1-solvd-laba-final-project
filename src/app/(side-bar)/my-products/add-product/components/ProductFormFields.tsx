import {
  Controller,
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form";
import { Box, FormHelperText } from "@mui/material";
import Input from "@/components/FormElements/Input";
import Select from "@/components/FormElements/Select";
import ShoeSizeOption from "@/app/products/[product-id]/components/ShoeSizeOption";
import { Danger } from "iconsax-react";
import { ProductFormData } from "../schema";

interface ProductFormFieldsProps {
  register: UseFormRegister<ProductFormData>;
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  colorOptions: { value: number; label: string }[];
  brandOptions: { value: number; label: string }[];
  sizeOptions: { value: number; label: number }[];
  selectedSizes: number[];
  toggleSize: (size: number) => void;
}

export const ProductFormFields = ({
  register,
  control,
  errors,
  colorOptions,
  brandOptions,
  sizeOptions,
  selectedSizes,
  toggleSize,
}: ProductFormFieldsProps) => {
  return (
    <>
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
    </>
  );
};
