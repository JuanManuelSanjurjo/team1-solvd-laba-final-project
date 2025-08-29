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

/**
 * Props for the ProductFormFields component.
 *
 * @property {UseFormRegister<ProductFormData>} register - `react-hook-form` register function for wiring inputs.
 * @property {Control<ProductFormData>} control - `react-hook-form` control object used for Controller-wrapped components.
 * @property {FieldErrors<ProductFormData>} errors - Validation errors object from `react-hook-form`.
 * @property {{ value: number; label: string }[]} colorOptions - Options for the color select.
 * @property {{ value: number; label: string }[]} brandOptions - Options for the brand select.
 * @property {{ value: number; label: number }[]} sizeOptions - Options for shoe sizes (value is id, label is display size).
 * @property {{ value: number; label: string }[]} categoryOptions - Options for category select.
 * @property {number[]} selectedSizes - Currently selected size ids.
 * @property {(size: number) => void} toggleSize - Callback to toggle a size id on/off in the form.
 * @property {UseFormGetValues<ProductFormData>} getValues - `react-hook-form` getValues helper used by the AI generation flow.
 * @property {UseFormSetValue<ProductFormData>} setValue - `react-hook-form` setValue helper used to programmatically set the description.
 * @property {UseFormSetError<ProductFormData>} setError - `react-hook-form` setError helper (optional) for mapping backend errors to fields.
 */

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

/**
 * ProductFormFields component that renders the product form fields.
 * Includes input fields for product details, color, brand, size, category, and description.
 *
 * @component
 * @param {ProductFormFieldsProps} props - The component props
 * @returns {JSX.Element} The rendered product form fields
 */
/**
 * ProductFormFields
 *
 * Renders the input fields for the product form and wires them to `react-hook-form`.
 * Includes an AI-powered "Generate description" button which calls `generateDescription` and
 * writes the returned description back into the `description` form field.
 *
 * The component intentionally keeps presentation logic minimal and delegates form state
 * to the parent via `register`, `control`, `getValues`, and `setValue`.
 *
 * @param {ProductFormFieldsProps} props - Props (see interface for details).
 * @returns {JSX.Element} Rendered form fields.
 *
 * @remarks
 * - The AI flow will display toasts using `useToastStore` for success, low-confidence, or branding errors.
 * - `getLabelFromOptions` is used to convert numeric select values back into human-readable labels for the AI prompt.
 */

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

  /**
   * Trigger AI generation of the product description using current form values.
   * The flow:
   * 1. Read current form values via `getValues()`.
   * 2. Reset the description field while generating.
   * 3. Call `generateDescription` with mapped labels for brand/category/color.
   * 4. Validate `aiResponse` for branding and confidence; show toasts for problems.
   * 5. If OK, write `aiResponse.description` into the form via `setValue("description", ...)`.
   */
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
