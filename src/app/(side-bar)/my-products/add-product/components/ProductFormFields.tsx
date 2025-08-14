import {
  Controller,
  UseFormRegister,
  Control,
  FieldErrors,
  useFormContext,
} from "react-hook-form";
import { Box, FormHelperText } from "@mui/material";
import Input from "@/components/FormElements/Input";
import Select from "@/components/FormElements/Select";
import ShoeSizeOption from "@/app/products/[product-id]/components/ShoeSizeOption";
import { Danger } from "iconsax-react";
import { ProductFormData } from "../schema";
import AiButton from "@/components/AiButton";
import { useState } from "react";
import { generateDescription } from "@/lib/ai/generateDescription";

interface ProductFormFieldsProps {
  register: UseFormRegister<ProductFormData>;
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  colorOptions: { value: number; label: string }[];
  brandOptions: { value: number; label: string }[];
  sizeOptions: { value: number; label: number }[];
  selectedSizes: number[];
  toggleSize: (size: number) => void;
  getValues: (name: string) => any;
  setValue: (name: any, value: any) => void;
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
  getValues,
  setValue,
}: ProductFormFieldsProps) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    const name = getValues("name");
    if (!name) return; // optionally show a toast or error

    setLoading(true);
    try {
      const aiDescription = await generateDescription(name);
      setValue("description", aiDescription);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
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
      <Box sx={{ position: "relative" }}>
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
        <AiButton
          variant="contained"
          size="small"
          isLoading={loading}
          onGenerate={handleGenerate}
          sx={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            zIndex: 1000,
          }}
        />
      </Box>
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
