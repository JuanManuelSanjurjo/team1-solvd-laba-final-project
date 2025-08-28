import {
  Controller,
  UseFormRegister,
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormSetError,
} from "react-hook-form";
import { Box, FormHelperText } from "@mui/material";
import Input from "@/components/form-elements/Input";
import Select from "@/components/form-elements/Select";
import ShoeSizeOption from "@/app/products/[product-id]/components/ShoeSizeOption";
import { Danger } from "iconsax-react";
import { ProductFormData } from "../types";
import AiButton from "@/components/AiButton";
import { useState } from "react";
import { generateDescription } from "@/lib/ai/generate-description";
import { getLabelFromOptions } from "@/lib/ai/ai-utils";
import { useToastStore } from "@/store/toastStore";

interface ProductFormFieldsProps {
  register: UseFormRegister<ProductFormData>;
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  colorOptions: { value: number; label: string }[];
  brandOptions: { value: number; label: string }[];
  sizeOptions: { value: number; label: number }[];
  categoryOptions: { value: number; label: string }[];
  selectedSizes: number[];
  toggleSize: (size: number) => void;
  getValues: UseFormGetValues<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  setError: UseFormSetError<ProductFormData>;
}

const CONFIDENCE_THRESHOLD = 0.6;

export const ProductFormFields = ({
  register,
  control,
  errors,
  colorOptions,
  brandOptions,
  sizeOptions,
  categoryOptions,
  selectedSizes,
  toggleSize,
  getValues,
  setValue,
}: ProductFormFieldsProps) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    const values = getValues();
    if (!values) return;

    setLoading(true);
    try {
      setValue("description", "");
      const aiResponse = await generateDescription({
        name: values.name,
        brand: getLabelFromOptions(brandOptions, values.brand),
        category: getLabelFromOptions(categoryOptions, values.categories),
        color: getLabelFromOptions(colorOptions, values.color),
        gender: values.gender === 3 ? "women" : "man",
        description: values.description,
      });
      if (aiResponse.isBranded === false) {
        useToastStore.getState().show({
          severity: "error",
          message:
            "AI detected this product name is likely not branded. Please review the product name.",
        });
      } else if (
        typeof aiResponse.confidence === "number" &&
        aiResponse.confidence < CONFIDENCE_THRESHOLD
      ) {
        useToastStore.getState().show({
          severity: "error",
          message: `AI is uncertain about branding (confidence ${(
            aiResponse.confidence * 100
          ).toFixed(0)}%). Please verify the product name.`,
        });
      } else {
        setValue("description", aiResponse.description);
        useToastStore.getState().show({
          severity: "success",
          message: "Description generated succesfully",
        });
      }
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

      <Controller
        name="categories"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            label="Category"
            name="category"
            options={categoryOptions}
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
          errorMessage={""}
          multiline
          fullWidth
          sx={{
            minHeight: "320px",
            alignItems: "flex-start",
            padding: 0,
            paddingBottom: 6,
          }}
        />
        <AiButton
          label="Use AI "
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
      {errors.description?.message && (
        <FormHelperText sx={{ color: "#FE645E", marginTop: "-10px" }}>
          <Danger color="#FE645E" size="16" style={{ marginRight: "6px" }} />
          {errors.description?.message}
        </FormHelperText>
      )}
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
